// custom logic here

// it assumes a data object exists

(function() {

// if no data, return
if (data === undefined) {
    $("#content").html("<h1>No data to load");
    return;
}

// set title
if (data["title"] !== undefined) {
    $("#content").append("<h1>" + data["title"] + "</h1>");
    $("#content").append("<hr/>");
}

// if index
if (data["type"] === "index") {
    var div = "<div>";
    div += "<p>Available plots:</p>";
    div += "<ul>";
    for (var i=0; i < data["links"].length; ++i) {
        var el = data["links"][i];
        div += "<li>";
        div += "<a href=\"" + el["id"] + ".html\">" + el["description"] + "</a>";
        div += "</li>";
    } 
    div += "</ul>";
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");
}
// end if index

// if single
if (data["type"] === "single") {
    var div;

    div  = "<div class=\"row\">";
    div += " <div class=\"col-md-6\">";
    div += "  <div id=\"chart1\"></div>";
    div += " </div>";
    div += " <div class=\"col-md-6\">";
    div += "  <div id=\"chart2\"></div>";
    div += " </div>";
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");

    div  = "<h2>Summary</h2>";
    div += "<div class=\"row\">";
    div += " <div class=\"col-md-6\">";
    div += "  <ul>";
    div += "   <li>ID: " + data["raw"]["id"] + "</li>";
    div += "   <li>Description: " + data["raw"]["configuration"]["description"] + "</li>";
    div += "   <li>Text length: " + data["raw"]["configuration"]["text_length"] + "</li>";
    div += "   <li>Audio length: " + d3.format(".03f")(data["raw"]["configuration"]["audio_length"]) + "</li>";
    div += "  </ul>";
    div += " </div>";
    div += " <div class=\"col-md-6\">";
    div += "  <ul>";
    div += "   <li>Machine: " + data["machine"] + "</li>";
    div += "   <li>Total mean time: " + d3.format(".03f")(data["raw"]["total_mean"]) + "</li>";
    div += "   <li>RTF mean: " + d3.format(".03f")(data["raw"]["rtf_mean"]) + "</li>";
    div += "  </ul>";
    div += " </div>";
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");

    div = "<h2>Configuration</h2>";
    div += "<pre>";
    div += JSON.stringify(data["raw"]["configuration"], null, "  ");
    div += "</pre>";
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");

    var pie_data = [];
    var his_lab = ["x"];
    var his_val = ["v"];
    var his_cum = ["c"];
    for (var i=0; i < data["raw"]["steps_mean_lab"].length; ++i) {
        var el = data["raw"]["steps_mean_lab"][i];
        pie_data.push([el["label"], el["value"]]);
        his_lab.push(el["label"]);
        his_val.push(el["value"]);
        his_cum.push(data["raw"]["steps_mean_cum_lab"][i]["value"]);
    }
    his_lab.push("total");
    his_val.push(data["raw"]["total_mean"]);
    his_cum.push(data["raw"]["total_mean"]);

    var chart1 = c3.generate({
        "bindto": "#chart1",
        "data": {
            "x": "x",
            "columns": [his_lab, his_val, his_cum],
            "types": {
                "v": "bar",
                "c": "area",
            },
            "names": {
                "v": "time",
                "c": "cumulated",
            },
            "groups": [["v"], ["c"]],
            "labels": false,
        },
        "axis": {
            "x": {
                "type": "category",
                "label": "step"
            },
            "y": {
                "label": "s"
            }
        }
    });

    var chart2 = c3.generate({
        "bindto": "#chart2",
        "data": {
            "columns": pie_data,
            "type": "pie",
        },
    });
}
// end if single


})();
