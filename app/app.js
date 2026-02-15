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
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
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
const path = require("path");
var _this = this;
var express = require('express');
var app = express();
var fs = require("fs/promises");
var port = 3000;
var prefix = path.join(__dirname, "..", "figmafiles");
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
                    return [4 /*yield*/, fs.readFile(path.join(prefix, filename), "utf8")];
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
app.get('/button-primary', function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
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
    });
});

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
    const json = await getJson("./../buttonTokens.json");
    if (json != null) {
        res.json(json);
    }
    else {
        res.status(500).json({ error: "Error Occured While While Fetching Data" });
    }
})

app.get('/searchbox', async (req, res) => {
    const json = await getJson("SearchBox-Default.json");
    if (json) res.json(json);
    else res.status(500).json({ error: "Error fetching SearchBox" });
});

// for display purposes (http://localhost:3000/preview/searchbox)
app.get("/preview/searchbox", async (req, res) => {
    const json = await getJson("SearchBox-Default.json")
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

// for display purposes (http://localhost:3000/preview/phasebanner-beta)
app.get("/phasebanner-beta", async (req, res) => {
    const json = await getJson("PhaseBanner-Beta.json");
    if (json) res.json(json);
    else res.status(500).json({ error: "Error fetching PhaseBanner-Beta" });
});

app.get("/preview/phasebanner-beta", async (req, res) => {
    const json = await getJson("PhaseBanner-Beta.json");
    if (!json) return res.status(500).send("No tokens");

    const t = json.phaseBanner.beta;

    res.send(`
    <html>
      <body style="font-family: system-ui; padding: 24px;">
        <div style="
          width:${t.container.width || 738}px;
          height:${t.container.height || 60}px;
          box-sizing:border-box;

          display:flex;
          align-items:center;
          gap:${t.container.gap || 0}px;

          background:${t.container.backgroundColor};
          padding:${t.container.padding.top || 0}px ${t.container.padding.right || 0}px ${t.container.padding.bottom || 0}px ${t.container.padding.left || 0}px;
        ">
          <span style="
            display:inline-flex;
            align-items:center;
            box-sizing:border-box;

            background:${t.tag?.backgroundColor || "#003865"};
            color:${t.tag?.textColor || "#fff"};

            padding:${t.tag?.padding.top || 6}px ${t.tag?.padding.right || 12}px ${t.tag?.padding.bottom || 6}px ${t.tag?.padding.left || 12}px;

            font-family:${t.tag?.typography?.fontFamily || "inherit"};
            font-size:${t.tag?.typography?.fontSize || 16}px;
            line-height:${t.tag?.typography?.lineHeight || 20}px;
            font-weight:${t.tag?.typography?.fontWeight || 600};
            white-space:nowrap;
          ">
            ${t.tag?.text || "Beta"}
          </span>

          <span style="
            box-sizing:border-box;
            color:${t.message?.color || "#000"};

            font-family:${t.message?.typography?.fontFamily || "inherit"};
            font-size:${t.message?.typography?.fontSize || 16}px;
            line-height:${t.message?.typography?.lineHeight || 24}px;
            font-weight:${t.message?.typography?.fontWeight || 400};

            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          ">
            ${t.message?.text || ""}
          </span>
        </div>
      </body>
    </html>
  `);
});

app.get("/preview/blockquote", async (req, res) => {
    const json = await getJson("Blockquote.json");
    if (!json) return res.status(500).send("No tokens");

    const t = json.blockquote.default;

    res.send(`
    <html>
      <body style="font-family: system-ui; padding: 40px;">
        <div style="
  position: relative;
  width:${t.container.width}px;
  box-sizing:border-box;
  padding-top: 0px;
">

  <div style="
    position:absolute;
    top:0;
    left:0;
    color:${t.icon.color};
    font-size:60px;
    line-height:1;
  ">❝</div>

  <div style="
    padding-left:${(t.icon.width ?? 40) + (t.container.gap ?? 18)}px;
    color:${t.text.color};
    font-family:${t.text.typography.fontFamily};
    font-size:${t.text.typography.fontSize}px;
    line-height:${t.text.typography.lineHeight}px;
    font-weight:${t.text.typography.fontWeight};
    letter-spacing:${t.text.typography.letterSpacing}px;
  ">
    ${t.text.text}
  </div>

</div>
      </body>
    </html>
  `);
});

app.get("/preview/downloadlink", async (req, res) => {
  const json = await getJson("DownloadLink-Default.json");
  if (!json) return res.status(500).send("No tokens");

  const t = json.downloadLink.default;

  res.send(`
    <html>
      <body style="font-family: system-ui; padding:40px; background:#fff;">
        <div style="
          width:${t.container.width || 744}px;
          height:${t.container.height || 97}px;
          background:${t.container.backgroundColor || "#f2f2f2"};
          display:flex;
          align-items:center;
          box-sizing:border-box;
          overflow:hidden;
        ">

          <!-- Left accent bar -->
          <div style="
            width:${t.accentBar?.width || 4}px;
            height:100%;
            background:${t.accentBar?.color || "#003865"};
            flex:0 0 auto;
          "></div>

          <!-- Text block -->
          <div style="
            flex:1;
            padding:16px 24px;
            display:flex;
            flex-direction:column;
            justify-content:center;
            gap:4px;
          ">
            <div style="
              color:${t.title?.color || "#333"};
              font-family:${t.title?.typography?.fontFamily || "inherit"};
              font-size:${t.title?.typography?.fontSize || 21}px;
              line-height:${t.title?.typography?.lineHeight || 26}px;
              font-weight:${t.title?.typography?.fontWeight || 400};
            ">
              ${t.title?.text || "Document title"}
            </div>

            <div style="
              color:${t.meta?.color || "#666"};
              font-family:${t.meta?.typography?.fontFamily || "inherit"};
              font-size:${t.meta?.typography?.fontSize || 16}px;
              line-height:${t.meta?.typography?.lineHeight || 21}px;
              font-weight:${t.meta?.typography?.fontWeight || 400};
            ">
              ${t.meta?.text || "PDF | 545K"}
            </div>
          </div>

          <!-- Divider -->
          <div style="
            width:1px;
            height:${t.divider?.height || 49}px;
            background:${t.divider?.color || "#ccc"};
            margin-right:18px;
          "></div>

          <!-- Icon -->
          <div style="
            width:64px;
            display:flex;
            justify-content:center;
            align-items:center;
            color:${t.icon?.color || "#9A3A06"};
            font-size:${Math.max(16, t.icon?.height || 24)}px;
            margin-right:12px;
          ">
            ↓
          </div>

        </div>
      </body>
    </html>
  `);
});


//Creating a webhook endpoint - receives updates at this endpoint
app.post('/updates', (req, res) => {
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
