function init() {
   
    d3.json("samples.json").then((sample) => {
        //Enter subjects id

        //Not sure if it is a good practice, but since the array is 0 dimensional is better to drop it
        sample = sample[0];

        d3.select("#selDataset")
            .selectAll('myOptions')
            .data(sample.names)
            .enter()
            .append('option')
            .text(function(d){return d;})
            .attr("value",function(d,i){return d,i;});

        //First subject information
            d3.select("#sample-metadata")
            .append("p")
            .text( "ID: "+sample.metadata[0].id)
            .append("p")
            .text("Ethnicity: "+sample.metadata[0].ethnicity)
            .append("p")
            .text("Gender: "+sample.metadata[0].gender)
            .append("p")
            .text("Age: "+sample.metadata[0].age)
            .append("p")
            .text("Location: "+sample.metadata[0].location)
            .append("p")
            .text("wffeq: "+sample.metadata[0].wfreq)
            .append("p")
            .text("bbtype: "+sample.metadata[0].bbtype)
            ;

        //initialize the plots    
            //They are already ordered, so top10 = first10... Hopefully
            let otu_ids=sample.samples[0].otu_ids.slice(0,10).reverse();
            
            //Bar chart
            let trace1 = {
             x: sample.samples[0].sample_values.slice(0,10).reverse(),
             y: otu_ids.map(function(e){return "OTU "+e.toString()}),
             labels: sample.samples[0].otu_labels.slice(0,10).reverse(),
             marker:{color:'#008B8B'},
             type: "bar",
             orientation: "h"};

             let layout={
                 title:'Top 10 OTUs per subject',
                 xaxis:{title:'Sample values'},
                 height:500,
                 width: 850
             };

            Plotly.newPlot('bar', [trace1],layout);

            //Bubble chart
            let bubbleIDs=sample.samples[0].otu_ids;
            let bubbleValues=sample.samples[0].sample_values;

            let trace2={
            x: bubbleIDs,
            y: bubbleValues,
            text: sample.samples[0].otu_labels,
            mode: 'markers',
            marker: {
                color: bubbleIDs,
                size: bubbleValues
                }    
            }
  
            layout = {
            title:'Sample values by OTU IDs',
            xaxis:{title:'OTU IDs'},
            yaxis:{title:'Sample values'},    
            showlegend: false,
            height: 800,
            width: 1200
            };
  
            Plotly.newPlot('bubble', [trace2], layout);
        
        
        });
    }

    //
function generatePlots(id){
    //Pull data
   d3.json("samples.json").then((sample)=>{
    sample = sample[0];
    
    //get metadata for id
    let metaData=sample.metadata[id];
    d3.select("#sample-metadata")
    .selectAll("p")
    .remove();
    d3.select("#sample-metadata")
    .append("p")
    .text( "ID: "+metaData.id)
    .append("p")
    .text("Ethnicity: "+metaData.ethnicity)
    .append("p")
    .text("Gender: "+metaData.gender)
    .append("p")
    .text("Age: "+metaData.age)
    .append("p")
    .text("Location: "+metaData.location)
    .append("p")
    .text("wffeq: "+metaData.wfreq)
    .append("p")
    .text("bbtype: "+metaData.bbtype)
    ;

    //get appropriate values for subject for the bar and bubble charts
    let otu_ids=sample.samples[id].otu_ids.slice(0,10).reverse();
    let sample_values=sample.samples[id].sample_values.slice(0,10).reverse();
    let otu_labels=sample.samples[id].otu_labels.slice(0,10).reverse();
    let upstrOtuIds=otu_ids.map(function(e){return "OTU "+e.toString()});
    let bubbleIDs=sample.samples[id].otu_ids;
    let bubbleValues=sample.samples[id].sample_values;
    let bubbleLabels=sample.samples[id].otu_labels;
    marker={
        color: bubbleIDs,
        size: bubbleValues
        };     
  


   // update the plots
    Plotly.restyle("bar", "x", [sample_values]);
    Plotly.restyle("bar", "y", [upstrOtuIds]);
    Plotly.restyle("bar","labels",[otu_labels]);
    Plotly.restyle("bubble", "x", [bubbleIDs]);
    Plotly.restyle("bubble", "y", [bubbleValues]);
    Plotly.restyle("bubble","text",[bubbleLabels]);
    Plotly.restyle("bubble","marker",[marker]);
   })

}

  
 // Called when drop menu is changed
 function optionChanged() {

   //Get value of dropdown menu
   let id = d3.select("#selDataset").property("value");
   //Function created in case I wanted to call it in different ways
    generatePlots(id);
}

//call init
init();