# SH27 Main
Design API

## Description

This project's aim is to find a way to be able to develop a consistent way of delivering the University of Glasgow's Design System to all of the disparate (dissimilar) platforms out there.

Current Implementation: Platforms that have implemented their set of Figma design files, have had to hardcode everything themselves.

## MVP

Working prototype where the design system is delivering design to a prototyped platform (e.g a mockup website that we make or StoryBook).

If the customer makes a change to their design files, then it is updated to any platform using their set of design files.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Installed from Gitlab Page

Dependencies are included inside the package.json and can be installed using "npm install"

## Usage
The API can be ran inside the ./app directory

A file exists inside the root directory that allows the creation of a webhook that will send updates to the API

Environment Variables That Need To Be Defined:
- TEAM_ID - The ID of the team
- FILE_ID - The ID of the figma library
- FIGMA_TOKEN - The Personal Access Token that has access to all the necessary privileges on figma
- NGROK_URL - Was needed to allow us to get webhook updates, however could be changed once API is on an actual server

## Authors and acknowledgment
Contributors:
-   Illia Bilyi
-   Jordan Majer
-   Marija Ali
-   Otgonbayar Bayansan
-   Phoenix Nelson
-   Tanvika Singh

## License
Licensed using MIT Licensing