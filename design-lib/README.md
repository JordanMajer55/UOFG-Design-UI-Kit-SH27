Everyone might need to download:
    npm install -D tsup typescript

Then, whenever a change is made to library you will need to run:
    npx tsup src/index.ts --format esm --dts
To build the library again with the up to date changes

Whenever a new function is made that needs to be exported ensure it is added to the "./src/index.ts" file


To install Library:
    npm install git+https://stgit.dcs.gla.ac.uk/team-project-h/2025/sh27/sh27-main.git
This can change once library is uploaded as a npm package