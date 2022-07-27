import { AxisBottom, AxisLeft } from "@visx/axis";
import { localPoint } from "@visx/event";
import { Group } from "@visx/group";
import appleStock, { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { defaultStyles, TooltipWithBounds, useTooltip } from "@visx/tooltip";
import useMeasure from "react-use-measure";
import { TouchEvent, MouseEvent } from "react";
import { timeFormat } from "d3-time-format";

const data = appleStock.slice(0, 10);
const margin = 32;
const defaultWidth = 100;
const defaultHeight = 100;
const getXValue = (d: AppleStock) => d.date;
const getYValue = (d: AppleStock) => d.close;

const toolTipStyles = {
  ...defaultStyles,
  borderRadius: 4,
  backgroud: "black",
  color: "white",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segeo UI", "Roboto", "Oxygen"',
};

//data

//margins

//width and height

//innerWidth and innerHeight (width - margins)

//create the svg

//define selectors

//define the scales

//create the axis

//group it all

const App = () => {
  const [ref, bounds] = useMeasure();
  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<AppleStock>();
  // useMeasure => this is going tpo give me a reference to add to my svg and the bounce which I'm gonna need to create it.

  const width = bounds.width || defaultWidth;
  const height = bounds.height || defaultHeight;

  const innerWidth = width - margin * 2;
  const innerHeight = height - margin * 2;

  const xScale = scaleBand<string>({
    range: [margin, innerWidth],
    domain: data.map(getXValue),
    padding: 0.2,
  });

  const yScale = scaleLinear<number>({
    range: [innerHeight, margin],
    domain: [
      Math.min(...data.map(getYValue)) - 1,
      Math.max(...data.map(getYValue)) + 1,
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
          {data.map((d) => {
            const xValue = getXValue(d);
            const barWidth = xScale.bandwidth();
            const barHeight = innerHeight - (yScale(getYValue(d)) ?? 0);

            const barX = xScale(xValue);
            const barY = innerHeight - barHeight;

            return (
              <Bar
                key={`bar-${xValue}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="orange"
                onMouseMove={(
                  e: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>
                ) => {
                  const point = localPoint(e);

                  if (!point) return;

                  showTooltip({
                    tooltipData: d,
                    tooltipLeft: point.x,
                    tooltipTop: point.y,
                  });
                }}
                onMouseLeave={() => hideTooltip()}
              />
            );
          })}
        </Group>

        <Group>{/* BAR */}</Group>

        <Group>
          {/* AXIS LEFT */}
          <AxisLeft left={margin} scale={yScale} />
        </Group>

        <Group>
          {/* AXIS BOTTOM */}
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            tickFormat={(date) => timeFormat("%m/%d")(new Date(date))}
          />
        </Group>
      </svg>

      {tooltipData ? (
        <TooltipWithBounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={toolTipStyles}
        >
          <b>{timeFormat("%b %d, %y")(new Date(getXValue(tooltipData)))}</b> :{" "}
          {getYValue(tooltipData)}
        </TooltipWithBounds>
      ) : null}
    </>
  );
  //viewbox => it takes care if someone spreads or shrink i.e. makes the chart small or big it's going to remain on 100%
};

export default App;
