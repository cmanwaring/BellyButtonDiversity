function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log(samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    filteredSample = samples.filter(sampleObject => sampleObject.id == sample);
    console.log(filteredSample);
    //  5. Create a variable that holds the first sample in the array.
    firstSample = filteredSample[0];
    console.log(firstSample);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = filteredSample[0].otu_ids;
    console.log(otu_ids);
    var otu_labels = filteredSample[0].otu_labels;
    console.log(otu_labels);
    var sample_values = filteredSample[0].sample_values;
    console.log(sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var otuTicks = otu_ids.map((widget) =>"OTU " + widget).slice(0,10).reverse();
    console.log(otuTicks);
    var sampleValueTicks = sample_values.map((widget) => parseInt(widget)).slice(0,10).reverse();
    console.log(sampleValueTicks);
    var otuLabels = otu_labels.slice(0,10).reverse();
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValueTicks,
      y: otuTicks,
      type: "bar",
      text: otuLabels,
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Betty Button Bacterial Composition",
      xaxis: {title: "Sample Values"},
      yaxis: {title: "OTU ID"}
    };

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sampleValueTicks,
      mode: 'markers',
      text: otuLabels,
      marker: {
        size: sampleValueTicks.reverse(),
        color: otu_ids,
        colorscale: "Earth",
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bubble chart reflecting populations of top 10 OTU samples",
      xaxis: {title:"OTU ID"},
      yaxis: {title: "Sample Values"}
      
    };

    // Create gauge chart
    // Create a variable that holds the samples array. 

    // Create a variable that filters the samples for the object with the desired sample number.

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaData = data.metadata;
    // Create filtered metaData
    var filteredMetaData = metaData.filter(sampleObject => sampleObject.id == sample);
    // Create a variable that holds the first sample in the array.
    // var firstSample = filteredSample[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstFilteredMeta = filteredMetaData[0];
    console.log(firstFilteredMeta);

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    // var otu_ids = filteredSample[0].otu_ids;
    // console.log(otu_ids);
    // var otu_labels = filteredSample[0].otu_labels;
    // console.log(otu_labels);
    // var sample_values = filteredSample[0].sample_values;
    // console.log(sample_values);

    // 3. Create a variable that holds the washing frequency.
    var wFreq = parseFloat(firstFilteredMeta.wfreq);
    console.log(wFreq);
    // Create the yticks for the bar chart.
    // done
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wFreq,
      type: "indicator",
      mode: "gauge+number",
      text: "Belly Button Washing Frequency"
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     
    };
    // Use Plotly to plot the bar data and layout.
    Plotly.newPlot("bar", barData, barLayout);
    
    // Use Plotly to plot the bubble data and layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
   
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
