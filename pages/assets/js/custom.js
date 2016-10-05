// custom logic here

// NOTE: eventually, the code "building" the HTML elements will be moved into the Python builders,
//       in this JS only the c3-related stuff will be kept

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
    var div = "";

    //div += "<div class=\"row\">";
    //div += "<div class=\"alert alert-warning\" role=\"alert\"><p><strong>Warning!</strong> This benchmark suite is work in progress!</p></div>";
    //div += "</div>";
    
    div += "<div class=\"row\">";
    div += " <h2>Comparisons</h2>";
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

    for (var i=0; i < data["ct"].length; ++i) {
        var el = data["ct"][i];
        div += "   <tr>";
        div += "    <td>" + (i+1) + "</td>";
        div += "    <td>" + el["id"] + "</a></td>";
        div += "    <td>" + el["description"] + "</td>";
        div += "    <td>";
        /*
        if (el["environments"].length > 1) {
            div += "<a class=\"btn btn-primary btn-sm\" href=\"pages/ctm." + el["id"] + ".html\" target=\"_blank\">Compare</a>&#160;";
        }
        */
        for (var j=0; j < el["environments"].length; ++j) {
            var env = el["environments"][j];
            if (env["has"]) {
                div += "<a class=\"btn btn-success btn-sm\" href=\"pages/ct." + el["id"] + "." + env["m"] + ".html\" target=\"_blank\">" + env["m"] + "</a>&#160;";
            } else {
                div += "<a class=\"btn btn-danger btn-sm\">" + env["m"] + "</a>&#160;";
            }
        }
        div += "    </td>";
        div += "   </tr>";
    }

    div += "  </tbody>";
    div += " </table>";
    div += "</div>";

    div += "<div class=\"row\">";
    div += " <h2>Single Tests</h2>";
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
    for (var i=0; i < data["single"].length; ++i) {
        var el = data["single"][i];
        div += "   <tr>";
        div += "    <td>" + (i+1) + "</td>";
        div += "    <td>" + el["id"] + "</a></td>";
        div += "    <td>" + el["description"] + "</td>";
        div += "    <td>";
        if (el["environments"].length > 1) {
            div += "<a class=\"btn btn-primary btn-sm\" href=\"pages/cm" + el["id"] + ".html\" target=\"_blank\">Compare</a>&#160;";
        }
        for (var j=0; j < el["environments"].length; ++j) {
            var env = el["environments"][j];
            if (env["has"]) {
                div += "<a class=\"btn btn-success btn-sm\" href=\"pages/" + el["id"] + "." + env["m"] + ".html\" target=\"_blank\">" + env["m"] + "</a>&#160;";
            } else {
                div += "<a class=\"btn btn-danger btn-sm\">" + env["m"] + "</a>&#160;";
            }
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
    div += "    <tr><td>ID</td><td><a href=\"#configuration\">" + d_raw["id"] + "</a></td></tr>";
    div += "    <tr><td>Description</td><td>" + d_conf["description"] + "</td></tr>";
    div += "    <tr><td>Text length (frags)</td><td>" + d_conf["text_length"] + "</td></tr>";
    div += "    <tr><td>Audio length (s)</td><td>" + d3.format(".03f")(d_conf["audio_length"]) + "</td></tr>";
    div += "    <tr><td>Runs (warmup+timed)</td><td>" + d_conf["execution"]["warmup_runs"] + " + " + d_conf["execution"]["timed_runs"] + "</td></tr>";
    div += "   </tbody>";
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
    div += "    <tr><td>Download</td><td><a class=\"btn btn-primary btn-sm\" href=\"" + d_raw["output_file"] + "\" role=\"button\" target=\"_blank\">JSON</a></td></tr>";
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
    div += "    <td><strong>Total (s)</strong></td>";
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
    div += " <h2 id=\"configuration\">Configuration</h2>";
    div += " <pre>";
    div += JSON.stringify(d_conf, null, "  ");
    div += " </pre>";
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");



    // prepare data for c3
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
                "label": "run time (s)"
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



// if cm 
if (data["type"] === "cm") {
    var div;

    var d_raw = data["raw"];
    var d_conf = d_raw[0]["configuration"];

    div  = "<div class=\"row\">";
    div += " <div class=\"col-md-4\">";
    div += "  <table class=\"table table-striped\">";
    div += "   <h2>Test</h2>";
    div += "   <thead>";
    div += "   <tr><th>Property</th><th>Value</th></tr>";
    div += "   </thead>";
    div += "   <tbody>";
    div += "    <tr><td>ID</td><td><a href=\"#configuration\">" + d_raw[0]["id"] + "</a></td></tr>";
    div += "    <tr><td>Description</td><td>" + d_conf["description"] + "</td></tr>";
    div += "    <tr><td>Text length (frags)</td><td>" + d_conf["text_length"] + "</td></tr>";
    div += "    <tr><td>Audio length (s)</td><td>" + d3.format(".03f")(d_conf["audio_length"]) + "</td></tr>";
    div += "    <tr><td>Runs (warmup+timed)</td><td>" + d_conf["execution"]["warmup_runs"] + " + " + d_conf["execution"]["timed_runs"] + "</td></tr>";
    div += "  </table>";
    div += " </div>";
    div += " <div class=\"col-md-8\">";
    div += "  <table class=\"table table-striped\">";
    div += "   <h2>Environment</h2>";
    div += "   <thead>";
    div += "   <tr><th>ID</th><th>Run time avg/std/min/max (s)</th><th>RTF avg/std/min/max</th><th>Download</th></tr>";
    div += "   </thead>";
    div += "   <tbody>";
    for (var i=0; i < d_raw.length; ++i) {
        var d_mraw = d_raw[i];
        var d_env = d_mraw["environment"];
        var d_env_desc = d_env["processor"] + ", " + d_env["ram"] + " RAM, " + d_env["os"] + ", Python " + d_env["python"];
        div += "<tr>";
        div += "<td><a title=\"" + d_env_desc + "\">" + d_env["label"] + "</a></td>";
        div += "<td>" + d3.format(".03f")(d_mraw["total_mean"]) + " / " + d3.format(".03f")(d_mraw["total_std"]) + " / " + d3.format(".03f")(d_mraw["total_min"]) + " / " + d3.format(".03f")(d_mraw["total_max"]) + "</td>";
        div += "<td>" + d3.format(".03f")(d_mraw["rtf_mean"]) + " / " + d3.format(".03f")(d_mraw["rtf_std"]) + " / " + d3.format(".03f")(d_mraw["rtf_min"]) + " / " + d3.format(".03f")(d_mraw["rtf_max"]) + "</td>";
        div += "<td><a class=\"btn btn-primary btn-sm\" href=\"" + d_mraw["output_file"] + "\" role=\"button\" target=\"_blank\">JSON</a></td>";
        div += "</tr>";
    } 
    div += "   </tbody>";
    div += "  </table>";
    div += " </div>"; 
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");

    // one column graphs
    div  = "<div class=\"row\">";
    div += " <div id=\"chart1\"></div>";
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");

    div  = "<div class=\"row\">";
    div += " <h2>Detail</h2>";
    div += " <table class=\"table table-hover\">";
    div += "  <thead>";
    div += "  <tr></tr>";
    div += "   <th>#</th>";
    div += "   <th>Step / Environment</th>";
    for (var i=0; i < d_raw.length; ++i) {
        var d_mraw = d_raw[i];
        var d_env = d_mraw["environment"];
        var d_env_desc = d_env["processor"] + ", " + d_env["ram"] + " RAM, " + d_env["os"] + ", Python " + d_env["python"];
        div += "   <th><a title=\"" + d_env_desc + "\">" + d_env["label"] + "</a> (s / %)</th>";
    }
    div += "  </tr>";
    div += "  </thead>";
    div += "  <tbody>";
    for (var i=0; i < d_raw[0]["labels"].length; ++i) {
        div += "   <tr>";
        div += "    <td>" + (i+1) + "</td>";
        div += "    <td>" + d_raw[0]["labels"][i] + "</td>";
        for (var j=0; j < d_raw.length; ++j) {
            var d_mraw = d_raw[j];
            div += "<td>" + d3.format(".03f")(d_mraw["steps_mean"][i]) + " / " + d3.format(".01f")(d_mraw["steps_mean"][i] / d_mraw["total_mean"] * 100) + "%</td>";
        }
        div += "   </tr>";
    }
    div += "   <tr>";
    div += "    <td></td>";
    div += "    <td><strong>Total (s)</strong></td>";
    for (var j=0; j < d_raw.length; ++j) {
        var d_mraw = d_raw[j];
        div += "<td>" + d3.format(".03f")(d_mraw["total_mean"]) + "</td>";
    }
    div += "   </tr>";
    div += "   <tr>";
    div += "    <td></td>";
    div += "    <td><strong>RTF</strong></td>";
    for (var j=0; j < d_raw.length; ++j) {
        var d_mraw = d_raw[j];
        div += "<td>" + d3.format(".03f")(d_mraw["rtf_mean"]) + "</td>";
    }
    div += "   </tr>";
    div += "  </tbody>";
    div += " </table>";
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");

    div  = "<div class=\"row\">";
    div += " <h2 id=\"configuration\">Configuration</h2>";
    div += " <pre>";
    div += JSON.stringify(d_conf, null, "  ");
    div += " </pre>";
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");



    // prepare data for c3
    var his_lab = ["x"];
    for (var i=0; i < d_raw[0]["labels"].length; ++i) {
        his_lab.push(d_raw[0]["labels"][i]);
    }
    his_lab.push("total");
    var columns = [his_lab];
    var names = {};
    var groups = [];
    for (var j=0; j < d_raw.length; ++j) {
        var d_mraw = d_raw[j];
        var vname = "v" + j;
        var his_val = [vname];
        for (var i=0; i < d_mraw["labels"].length; ++i) {
            his_val.push(d_mraw["steps_mean"][i]);
        }
        his_val.push(d_mraw["total_mean"]);
        columns.push(his_val);
        names[vname] = d_mraw["environment"]["label"];
        groups.push([vname]);
    }

    var chart1 = c3.generate({
        "bindto": "#chart1",
        "data": {
            "x": "x",
            "columns": columns,
            "type": "bar",
            "names": names,
            "groups": groups,
            /*
            "labels": {
                "format": function(v, id) {
                    return d3.format(".03f")(v);
                }
            }
            */
        },
        "axis": {
            "x": {
                "type": "category",
                "label": "step"
            },
            "y": {
                "label": "run time (s)"
            }
        },
        "legend": {
            "show": true,
            "position": "right"
        }
    });
}
// end if cm





// if cm 
if (data["type"] === "ct") {
    var div;

    var d_raw = data["raw"];
    var d_conf = d_raw[0]["configuration"];
    var d_env = d_raw[0]["environment"];

    div  = "<div class=\"row\">";
    div += " <table class=\"table table-striped\">";
    div += "  <thead>";
    div += "  <tr><th>Property</th><th>Values</th></tr>";
    div += "  </thead>";
    div += "  <tbody>";
    div += "   <tr><td>Configurations</td>";
    div += "    <td>";
    for (var i=0; i < d_raw.length; ++i) {
        div += "<a title=\"" + d_raw[i]["configuration"]["description"] + "\">" + d_raw[i]["id"] + "</a>&#160;&#160;&#160;";
    } 
    div += "    </td>";
    div += "   </tr>";
    div += "   <tr><td>Environment</td><td>" + d_env["label"] + " : " + d_env["processor"] + ", " + d_env["ram"] + " RAM, " + d_env["os"] + ", Python " + d_env["python"] + "</td></tr>";
    if (d_env["notes"]) {
        div += "    <tr><td>Notes</td><td>" + d_env["notes"] + "</td></tr>";
    }
    div += "  </tbody>";
    div += " </table>";
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");

    // one column graphs
    div  = "<div class=\"row\">";
    div += " <div id=\"chart1\"></div>";
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");

    div  = "<div class=\"row\">";
    div += " <h2>Detail</h2>";
    div += " <table class=\"table table-hover\">";
    div += "  <thead>";
    div += "  <tr></tr>";
    div += "   <th>#</th>";
    div += "   <th>Step / Test</th>";
    for (var i=0; i < d_raw.length; ++i) {
        var d_mraw = d_raw[i];
        div += "   <th><a title=\"" + d_mraw["configuration"]["description"] + "\">" + d_mraw["id"] + "</a> (s / %)</th>";
    }
    div += "  </tr>";
    div += "  </thead>";
    div += "  <tbody>";
    for (var i=0; i < d_raw[0]["labels"].length; ++i) {
        div += "   <tr>";
        div += "    <td>" + (i+1) + "</td>";
        div += "    <td>" + d_raw[0]["labels"][i] + "</td>";
        for (var j=0; j < d_raw.length; ++j) {
            var d_mraw = d_raw[j];
            div += "<td>" + d3.format(".03f")(d_mraw["steps_mean"][i]) + " / " + d3.format(".01f")(d_mraw["steps_mean"][i] / d_mraw["total_mean"] * 100) + "%</td>";
        }
        div += "   </tr>";
    }
    div += "   <tr>";
    div += "    <td></td>";
    div += "    <td><strong>Total (s)</strong></td>";
    for (var j=0; j < d_raw.length; ++j) {
        var d_mraw = d_raw[j];
        div += "<td>" + d3.format(".03f")(d_mraw["total_mean"]) + "</td>";
    }
    div += "   </tr>";
    div += "   <tr>";
    div += "    <td></td>";
    div += "    <td><strong>Audio length (s)</strong></td>";
    for (var j=0; j < d_raw.length; ++j) {
        var d_mraw = d_raw[j];
        div += "<td>" + d3.format(".03f")(d_mraw["configuration"]["audio_length"]) + "</td>";
    }
    div += "   </tr>";
    div += "   <tr>";
    div += "    <td></td>";
    div += "    <td><strong>RTF</strong></td>";
    for (var j=0; j < d_raw.length; ++j) {
        var d_mraw = d_raw[j];
        div += "<td>" + d3.format(".03f")(d_mraw["rtf_mean"]) + "</td>";
    }
    div += "   </tr>";
    div += "  </tbody>";
    div += " </table>";
    div += "</div>";
    $("#content").append(div);
    $("#content").append("<hr/>");



    // prepare data for c3
    var his_lab = ["x"];
    for (var j=0; j < d_raw.length; ++j) {
        his_lab.push(d_raw[j]["configuration"]["audio_length"]);
    }
    var columns = [his_lab];
    var steps = [];
    for (var j=0; j < d_raw[0]["labels"].length; ++j) {
        steps.push([d_raw[0]["labels"][j]]);
    }
    for (var j=0; j < d_raw.length; ++j) {
        var d_mraw = d_raw[j];
        for (var i=0; i < d_mraw["steps_mean_cum"].length; ++i) {
            steps[i].push(d_mraw["steps_mean_cum"][i]);
        }
    }
    for (var j=0; j < d_raw[0]["labels"].length; ++j) {
        columns.push(steps[j]);
    }
    var chart1 = c3.generate({
        "bindto": "#chart1",
        "data": {
            "x": "x",
            "columns": columns,
            "type": "area",
            /*
            "labels": {
                "format": function(v, id) {
                    return d3.format(".03f")(v);
                }
            }
            */
        },
        "axis": {
            "x": {
                "label": "audio length (s)"
            },
            "y": {
                "label": "cumulated run time (s)"
            }
        },
        "legend": {
            "show": true,
            "position": "right"
        }
    });
}
// end if ct



})();
