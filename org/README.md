## For running the project:

`nx serve impexgenerator`

Currently using spartan, read more about on https://www.spartan.ng/ :)

# Generate the build:
nx build impexgenerator --prod --base-href=/impex-generator/

# Change the prefix on dist/client folder in index.html:
# Add /impex-generator/

# Deploy on GitHub Pages:
npx angular-cli-ghpages --dir=dist/impexgenerator/client
