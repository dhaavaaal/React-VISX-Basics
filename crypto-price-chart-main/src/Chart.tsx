import { curveMonotoneX } from "@visx/curve";
import { localPoint } from "@visx/event";
import { Group } from "@visx/group";
import { scaleLinear, scaleTime } from "@visx/scale";
import { Bar, Line, LinePath } from "@visx/shape";
import { defaultStyles, TooltipWithBounds, useTooltip } from "@visx/tooltip";
import { bisector, extent } from "d3-array";
import { timeFormat } from "d3-time-format";
import { MouseEvent, TouchEvent } from "react";
import { useQuery } from "react-query";
import useMeasure from "react-use-measure";

type DataPoint = [number, number];

const getXValue = (d: DataPoint) => new Date(d[0]);
const getYValue = (d: DataPoint) => d[1];

const bisectDate = bisector<DataPoint, Date>(getXValue).left;

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const toolTipStyles = {
  ...defaultStyles,
  borderRadius: 4,
  backgroud: "black",
  color: "white",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segeo UI", "Roboto", "Oxygen"',
};

const getPrices = async () => {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7"
  );

  const data = await res.json();
  const { prices } = data;
  return prices;
};

const Chart = () => {
  const { data, error, isLoading } = useQuery<DataPoint[]>("prices", getPrices);
  const [ref, bounds] = useMeasure();
  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<DataPoint>();

  const width = bounds.width || 100;
  const height = bounds.height || 100;

  if (isLoading) return <h1>Loading...</h1>;

  if (error) return <h1>Error!!</h1>;

  if (!data) return <h1>No Data!!</h1>;

  //extent =>It's literally a helper to parse the data and its easier to use it
  //like its going to get like each value from here and its going to pass run a
  //map here return from one.
  const xScale = scaleTime({
    range: [0, width],
    domain: extent(data, getXValue) as [Date, Date],
  });
  const yScale = scaleLinear<number>({
    range: [height, 0],
    domain: [
      Math.min(...data.map(getYValue)),
      Math.max(...data.map(getYValue)),
    ],
  });

  return (
    <>
      <svg
        ref={ref}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
      >
        <Group>
          <LinePath<DataPoint>
            data={data}
            x={(d) => xScale(getXValue(d)) ?? 0}
            y={(d) => yScale(getYValue(d)) ?? 0}
            stroke="#23DBBD"
            strokeWidth={2}
            curve={curveMonotoneX}
          />
        </Group>

        <Group>
          <Bar
            width={width}
            height={height}
            fill="transparent"
            onMouseMove={(
              e: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>
            ) => {
              const { x } = localPoint(e) || { x: 0 };
              const x0 = xScale.invert(x);

              const index = bisectDate(data, x0, 1);

              const d0 = data[index - 1];
              const d1 = data[index];

              //This is really common in all down here
              let d = d0;
              if (d1 && getXValue(d1)) {
                d =
                  x0.valueOf() - getXValue(d0).valueOf() >
                  getXValue(d1).valueOf() - x0.valueOf()
                    ? d1
                    : d0;
              }
              showTooltip({
                tooltipData: d,
                tooltipLeft: x,
                tooltipTop: yScale(getYValue(d)),
              });
            }}
            onMouseLeave={() => hideTooltip()}
          />
        </Group>

        {tooltipData ? (
          <Group>
            <Line
              from={{ x: tooltipLeft, y: 0 }}
              to={{ x: tooltipLeft, y: height }}
              stroke="#59588D"
              strokeWidth={1}
              pointerEvents="none"
              strokeDasharray="5,5"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={8}
              fill="#FF4DCA"
              fillOpacity={0.5}
              pointerEvents="none"
            />
          </Group>
        ) : null}
      </svg>

      {tooltipData ? (
        <TooltipWithBounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={toolTipStyles}
        >
          {`${timeFormat("%b %d %H:%M ")(new Date(getXValue(tooltipData)))}`}:{" "}
          <b>{formatter.format(getYValue(tooltipData))}</b>
        </TooltipWithBounds>
      ) : null}
    </>
  );
};
export default Chart;
