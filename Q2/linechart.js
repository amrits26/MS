const svgContainer = d3.select("body").append("svg")
   .attr("width", 1000)
   .attr("height", 800)
   .attr("viewBox", "0 -30 1500 1000");

const dataUrl = "https://raw.githubusercontent.com/amrits26/MS/refs/heads/main/data_sample.csv";

d3.csv(dataUrl, d => {
   return {
      date: new Date(d.date),
      estimateCost: +d.EstimatedCost,
      materialCost: +d.RawMaterial,
      laborCost: +d.Workmanship,
      storageExpense: +d.StorageCost,
   };
}).then(chartData => {
   console.table(chartData);

   // Calculate additional fields
   chartData.forEach(d => {
      d.totalCost = d.materialCost + d.laborCost + d.storageExpense;
      d.salePrice = d.estimateCost * 1.1;
      d.profitMargin = d.salePrice - d.totalCost;
   });

   // X and Y axis scales
   const scaleX = d3.scaleTime()
      .domain(d3.extent(chartData, d => d.date))
      .range([0, 800]);

   const scaleY = d3.scaleLinear()
      .domain([
         d3.min(chartData, d => Math.min(d.estimateCost, d.totalCost, d.salePrice, d.profitMargin)),
         d3.max(chartData, d => Math.max(d.estimateCost, d.totalCost, d.salePrice, d.profitMargin))
      ])
      .nice()
      .range([800, 0]);

   // Draw horizontal grid lines
   svgContainer.selectAll("hline")
      .data(scaleY.ticks(15))
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", 0)
      .attr("x2", 800)
      .attr("y1", d => scaleY(d))
      .attr("y2", d => scaleY(d));

   // Draw vertical grid lines
   svgContainer.selectAll("vline")
      .data(scaleX.ticks(15))
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", d => scaleX(d))
      .attr("x2", d => scaleX(d))
      .attr("y1", 0)
      .attr("y2", 800);

   // Line generators
   const lineEstimate = d3.line()
      .x(d => scaleX(d.date))
      .y(d => scaleY(d.estimateCost));

   const lineTotalCost = d3.line()
      .x(d => scaleX(d.date))
      .y(d => scaleY(d.totalCost));

   const lineSalePrice = d3.line()
      .x(d => scaleX(d.date))
      .y(d => scaleY(d.salePrice));

   const lineProfitMargin = d3.line()
      .x(d => scaleX(d.date))
      .y(d => scaleY(d.profitMargin));

   // Color scale for lines
   const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

   // Append lines to the SVG
   svgContainer.append("path")
      .data([chartData])
      .attr("class", "line")
      .attr("d", lineEstimate)
      .style("stroke", colorScale(0));

   svgContainer.append("path")
      .data([chartData])
      .attr("class", "line")
      .attr("d", lineTotalCost)
      .style("stroke", colorScale(1));

   svgContainer.append("path")
      .data([chartData])
      .attr("class", "line")
      .attr("d", lineSalePrice)
      .style("stroke", colorScale(2));

   svgContainer.append("path")
      .data([chartData])
      .attr("class", "line")
      .attr("d", lineProfitMargin)
      .style("stroke", colorScale(3));

   // Add transitions
   svgContainer.selectAll(".line")
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1);

   // Draw x-axis
   svgContainer.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0, 800)")
      .call(d3.axisBottom(scaleX).tickValues(chartData.map(d => d.date)).tickFormat(d3.timeFormat("%d %b %Y")))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em")
      .attr("transform", "rotate(-65)");

   svgContainer.append("text")
      .attr("class", "axis-label")
      .attr("x", 400)
      .attr("y", 910)
      .attr("fill", "#000")
      .text("Date");

   // Draw y-axis
   svgContainer.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(scaleY).ticks((scaleY.domain()[1] - scaleY.domain()[0]) / 200))
      .append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -400)
      .attr("y", -80)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Costs");

   // Legend
   const legendGroup = svgContainer.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(900, 50)");

   const legendItems = legendGroup.selectAll("g")
      .data(["Estimated Cost", "Total Cost", "Sold Price", "Profit Margin"])
      .enter().append("g")
      .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

   legendItems.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", (d, i) => colorScale(i))
      .style("stroke", "black");

   legendItems.append("text")
      .attr("x", 20)
      .attr("y", 10)
      .style("fill", (d, i) => colorScale(i))
      .text(d => d);
});