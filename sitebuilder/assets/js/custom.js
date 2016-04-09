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
    var div;
    div  = "<div class=\"row\">";
    div += " <h1>" + data["title"] + "</h1>"
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");
}

// if index
if (data["type"] === "index") {
    var div;
    div  = "<div class=\"row\">";
    div += " <table class=\"table table-striped\">";
    div += "  <thead>";
    div += "  <tr></tr>";
    div += "   <th>#</th>";
    div += "   <th>ID</th>";
    div += "   <th>Description</th>";
    div += "   <th>Runs</th>";
    div += "  </tr>";
    div += "  </thead>";
    div += "  <tbody>";
    for (var i=0; i < data["links"].length; ++i) {
        var el = data["links"][i];
        div += "   <tr>";
        div += "    <td>" + (i+1) + "</td>";
        div += "    <td>" + el["id"] + "</a></td>";
        div += "    <td>" + el["description"] + "</td>";
        div += "    <td>";
        for (var j=0; j < el["environments"].length; ++j) {
            var env = el["environments"][j];
            div += "<a class=\"btn btn-primary btn-sm\" href=\"" + el["id"] + "." + env + ".html\">" + env + "</a>";
        }
        div += "    </td>";
        div += "   </tr>";
    } 
    div += "  </tbody>";
    div += " </table>";
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");
}
// end if index

// if single
if (data["type"] === "single") {
    var div;

    var d_raw = data["raw"];
    var d_conf = d_raw["configuration"];
    var d_env = d_raw["environment"];

    div  = "<div class=\"row\">";
    div += " <div class=\"col-md-4\">";
    div += "  <table class=\"table table-striped\">";
    div += "   <h2>Test</h2>";
    div += "   <thead>";
    div += "   <tr><th>Property</th><th>Value</th></tr>";
    div += "   </thead>";
    div += "   <tbody>";
    div += "    <tr><td>ID</td><td>" + d_raw["id"] + "</td></tr>";
    div += "    <tr><td>Description</td><td>" + d_conf["description"] + "</td></tr>";
    div += "    <tr><td>Text length (frags)</td><td>" + d_conf["text_length"] + "</td></tr>";
    div += "    <tr><td>Audio length (s)</td><td>" + d3.format(".03f")(d_conf["audio_length"]) + "</td></tr>";
    div += "  </table>";
    div += " </div>";
    div += " <div class=\"col-md-8\">";
    div += "  <table class=\"table table-striped\">";
    div += "   <h2>Environment</h2>";
    div += "   <thead>";
    div += "   <tr><th>Property</th><th>Value</th></tr>";
    div += "   </thead>";
    div += "   <tbody>";
    div += "    <tr><td>ID</td><td>" + d_env["label"] + "</td></tr>";
    div += "    <tr><td>Description</td><td>" + d_env["processor"] + ", " + d_env["ram"] + " RAM, " + d_env["os"] + ", Python " + d_env["python"] + "</td></tr>";
    if (d_env["notes"]) {
        div += "    <tr><td>Notes</td><td>" + d_env["notes"] + "</td></tr>";
    }
    div += "    <tr><td>Run time avg/std/min/max (s)</td><td>" + d3.format(".03f")(d_raw["total_mean"]) + " / " + d3.format(".03f")(d_raw["total_std"]) + " / " + d3.format(".03f")(d_raw["total_min"]) + " / " + d3.format(".03f")(d_raw["total_max"]) + "</td></tr>";
    div += "    <tr><td>RTF avg/std/min/max</td><td>" + d3.format(".03f")(d_raw["rtf_mean"]) + " / " + d3.format(".03f")(d_raw["rtf_std"]) + " / " + d3.format(".03f")(d_raw["rtf_min"]) + " / " + d3.format(".03f")(d_raw["rtf_max"]) + "</td></tr>";
    div += "    <tr><td>Download</td><td><a class=\"btn btn-primary btn-sm\" href=\"results/" + d_raw["output_file"] + "\" role=\"button\" target=\"_blank\">JSON</a></td></tr>";
    div += "   </tbody>";
    div += "   </tbody>";
    div += "  </table>";
    div += " </div>"; 
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");

    /*
    // two columns graphs
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
    */

    // one column graphs
    div  = "<div class=\"row\">";
    div += " <div id=\"chart1\"></div>";
    div += "</div>";
    div += "<div class=\"row\">";
    div += " <div id=\"chart2\"></div>";
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");

    div  = "<div class=\"row\">";
    div += " <h2>Detail</h2>";
    div += " <table class=\"table table-hover\">";
    div += "  <thead>";
    div += "  <tr></tr>";
    div += "   <th>#</th>";
    div += "   <th>Step</th>";
    div += "   <th>Run time Avg (s)</th>";
    div += "   <th>Run time Avg (%)</th>";
    div += "   <th>Run time Std (s)</th>";
    div += "   <th>Run time Min (s)</th>";
    div += "   <th>Run time Max (s)</th>";
    div += "  </tr>";
    div += "  </thead>";
    div += "  <tbody>";
    for (var i=0; i < d_raw["labels"].length; ++i) {
        div += "   <tr>";
        div += "    <td>" + (i+1) + "</td>";
        div += "    <td>" + d_raw["labels"][i] + "</td>";
        div += "    <td>" + d3.format(".03f")(d_raw["steps_mean"][i]) + "</td>";
        div += "    <td>" + d3.format(".01f")(d_raw["steps_mean"][i] / d_raw["total_mean"] * 100) + "</td>";
        div += "    <td>" + d3.format(".03f")(d_raw["steps_std"][i]) + "</td>";
        div += "    <td>" + d3.format(".03f")(d_raw["steps_min"][i]) + "</td>";
        div += "    <td>" + d3.format(".03f")(d_raw["steps_max"][i]) + "</td>";
        div += "   </tr>";
    }    
    div += "   <tr>";
    div += "    <td></td>";
    div += "    <td><strong>total</strong></td>";
    div += "    <td>" + d3.format(".03f")(d_raw["total_mean"]) + "</td>";
    div += "    <td></td>";
    div += "    <td>" + d3.format(".03f")(d_raw["total_std"]) + "</td>";
    div += "    <td>" + d3.format(".03f")(d_raw["total_min"]) + "</td>";
    div += "    <td>" + d3.format(".03f")(d_raw["total_max"]) + "</td>";
    div += "   </tr>";
    div += "  </tbody>";
    div += " </table>";
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");


    div  = "<div class=\"row\">";
    div += " <h2>Configuration</h2>";
    div += " <pre>";
    div += JSON.stringify(d_conf, null, "  ");
    div += " </pre>";
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");

    var pie_data = [];
    var his_lab = ["x"];
    var his_val = ["v"];
    var his_cum = ["c"];
    for (var i=0; i < d_raw["labels"].length; ++i) {
        var label = d_raw["labels"][i];
        var value = d_raw["steps_mean"][i];
        var value_cum = d_raw["steps_mean_cum"][i];
        pie_data.push([label, value]);
        his_lab.push(label);
        his_val.push(value);
        his_cum.push(value_cum); 
    }
    his_lab.push("total");
    his_val.push(d_raw["total_mean"]);
    his_cum.push(d_raw["total_mean"]);

    var chart1 = c3.generate({
        "bindto": "#chart1",
        "data": {
            "x": "x",
            "columns": [his_lab, his_val, his_cum],
            "types": {
                "v": "bar",
                "c": "step",
            },
            "names": {
                "v": "step run time",
                "c": "cumulated run time",
            },
            "groups": [["v"], ["c"]],
            "labels": {
                "format": function(v, id) {
                    return d3.format(".03f")(v);
                }
            } 
        },
        "axis": {
            "x": {
                "type": "category",
                "label": "step"
            },
            "y": {
                "label": "s"
            }
        },
        "legend": {
            "show": true,
            "position": "right"
        }
    });

    var chart2 = c3.generate({
        "bindto": "#chart2",
        "data": {
            "columns": pie_data,
            "type": "pie",
        },
        "legend": {
            "show": true,
            "position": "right"
        }
    });
}
// end if single


})();
