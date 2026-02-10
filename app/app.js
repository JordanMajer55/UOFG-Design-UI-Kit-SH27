var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var express = require('express');
var app = express();
var fs = require("fs/promises");
var port = 3000;
var path = require("path");
var prefix = path.join(__dirname, "..", "figmafiles") + path.sep;
var cors = require("cors"); // only needed to be able to test on same machine as API
app.use(cors());
// function to read requested json file
function getJson(filename) {
    return __awaiter(this, void 0, void 0, function () {
        var data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.readFile(prefix + filename, 'utf8')];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, JSON.parse(data)];
                case 2:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// end-point point for primary button
app.get('/button-primary', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var json;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getJson("Button.json")];
            case 1:
                json = _a.sent();
                if (json != null) {
                    res.json(json);
                }
                else {
                    res.status(500).json({ error: "Error Occured While While Fetching Data" });
                }
                return [2 /*return*/];
        }
    });
}); });

app.get('/button-secondary', async (req, res) => {
  const json = await getJson("Button-Secondary.json");

  if (json != null) {
    res.json(json);
  } else {
    res.status(500).json({ error: "Error Occured While While Fetching Data" });
  }
});


//endpoint for client to receive the json files - usually for a specific component
app.get('/button-primary', async (req, res) => {
    const json = await getJson("buttonTokens.json");
    if (json != null) {
        res.json(json);
    }
    else {
        res.status(500).json({error: "Error Occured While While Fetching Data"});
    }
})

app.get('/searchbox', async (req, res) => {
  const json = await getJson("SearchBox-Default.json");
  if (json) res.json(json);
  else res.status(500).json({ error: "Error fetching SearchBox" });
});

app.get('/uog-logo', async (req, res) => {
  const json = await getJson("Logo-Default.json");
  if (json) res.json(json);
  else res.status(500).json({ error: "Error fetching UoG Logo" });
});

app.get('/header-text', async (req, res) => {
  const json = await getJson("Header.json");
  if (json) res.json(json);
  else res.status(500).json({ error: "Error fetching Header" });
});

app.get('/breadcrumb', async (req, res) => {
  const json = await getJson("Breadcrumb.json");
  if (json) res.json(json);
  else res.status(500).json({ error: "Error fetching Breadcrumb" });
});

// for display purposes (http://localhost:3000/preview/searchbox)
app.get("/preview/searchbox", async (req, res) => {
  const json = await getJson("SearchBox-Default.json");
  if (!json) return res.status(500).send("No tokens");

  const t = json.searchBox.default;

  res.send(`
    <html>
      <body style="font-family: system-ui; padding: 24px;">
        <div style="display:flex; gap:12px; align-items:center;">
          <div style="
            width:${t.input.width}px;
            height:${t.input.height}px;
            background:${t.input.backgroundColor};
            border:${t.input.borderWidth}px solid ${t.input.borderColor};
            display:flex;
            align-items:center;
            padding:0 12px;
            box-sizing:border-box;
          ">
            <span style="opacity:0.5;">Search…</span>
          </div>

          <button style="
            height:${t.button.height}px;
            background:${t.button.backgroundColor};
            border:none;
            border-radius:${t.button.borderRadius}px;
            padding:${t.button.padding.top}px ${t.button.padding.right}px;
            color:${t.button.textColor};
            font-family:${t.button.typography?.fontFamily || "inherit"};
            font-size:${t.button.typography?.fontSize}px;
            line-height:${t.button.typography?.lineHeight}px;
            font-weight:${t.button.typography?.fontWeight};
            cursor:pointer;
          ">
            ${t.button.text || "Search"}
          </button>
        </div>
      </body>
    </html>
  `);
});

// for display purposes (http://localhost:3000/preview/header)
app.get("/preview/header", async (req, res) => {
  const json = await getJson("Header.json");
  if (!json) return res.status(500).send("No tokens");

  const t = json.header;
  const items = Array.isArray(t?.items) && t.items.length
    ? t.items
    : (t?.text ? [t.text] : []);

  res.send(`
    <html>
    <body style="font-family: system-ui; padding: 24px;">
      <div style="
        display:flex;
        align-items:center;
        gap:24px;
        font-family:${t?.typography?.fontFamily || "inherit"};
        font-size:${t?.typography?.fontSize ?? 16}px;
        font-weight:${t?.typography?.fontWeight ?? 400};
        line-height:${t?.typography?.lineHeightPx ?? 20}px;
        letter-spacing:${t?.typography?.letterSpacing ?? 0}px;
        color:${t?.color ?? "inherit"};
      ">
        ${items.map((item) => `<span>${item}</span>`).join("")}
      </div>
    </body>
    </html>
  `);
});


// for display purposes (http://localhost:3000/preview/logo)
app.get("/preview/logo", async (req, res) => {
  const json = await getJson("Logo-Default.json");
  if (!json) return res.status(500).send("No tokens");

  const t = json.uogLogo;

  res.send(`
    <html>
      <body style="font-family: system-ui; padding: 24px;">
        <img src="${t?.pngUrl || ""}" style="display:block;" />
      </body>
    </html>
  `);
});

// for display purposes (http://localhost:3000/preview/breadcrumb)
app.get("/preview/breadcrumb", async (req, res) => {
  const json = await getJson("Breadcrumb.json");
  if (!json) return res.status(500).send("No tokens");

  const t = json.breadcrumb;
  const items = Array.isArray(t?.items) && t.items.length ? t.items : [];

  res.send(`
    <html>
    <body style="font-family: system-ui; padding: 24px;">
      <div style="
        display:flex;
        align-items:center;
        gap:${t?.itemSpacing ?? 12}px;
        padding:${t?.paddingTop ?? 0}px ${t?.paddingRight ?? 0}px ${t?.paddingBottom ?? 0}px ${t?.paddingLeft ?? 0}px;
        box-sizing:border-box;
        font-family:${t?.typography?.fontFamily || "inherit"};
        font-size:${t?.typography?.fontSize ?? 16}px;
        font-weight:${t?.typography?.fontWeight ?? 400};
        line-height:${t?.typography?.lineHeightPx ?? 21}px;
        letter-spacing:${t?.typography?.letterSpacing ?? 0}px;
      ">
        ${items.map((item, i) =>
          i === 0
            ? `<span>${item}</span>`
            : `<span style="opacity:.5;">›</span><span>${item}</span>`
        ).join("")}
      </div>
    </body>
    </html>
  `);
});

//Creating a webhook endpoint - receives updates at this endpoint
app.post('/updates',(req,res) =>{
    console.log('Updating changes made ....');
    console.log(req.body);
    //whatever we decide to do with this data - put it in a new file 
    // or update a curr ver
    //extract whats needed and put through a generating token func
    
   
    res.status(200);
})

app.listen(port, () => {
    console.log(`This is the local webserver, running at http://localhost:${port}`);
})
