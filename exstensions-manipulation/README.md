
# Extension Installer

The `vscode-extension-installer.mjs` script is a Node.js script that installs or updates Visual Studio Code extensions based on a list of extension names provided in a text file. It provides options to force installation/update, enable installation progress logging, and display installation result tables.

To use the extension installer, follow the instructions below:

### Usage

```
./vscode-extension-installer.mjs [filepath]

```

Replace `[filepath]` with the path to your text file containing the list of extension names.

Optional flags:
- `--force` or `-f`: Force installation/update.
- `--log` or `-l`: Enable installation progress logging (default: enabled).
- `--table` or `-t`: Display installation result tables (default: enabled).

1. The script will read the text file, install or update the specified extensions, and provide installation progress and result information.

Note: Make sure to provide the correct file path and use the appropriate flags when running the script.

# Extension extraction from extensions.json

```
./vscode-extension-extractor.mjs [filepath: eg. extensions.json] --key [eg. path]
```

For example, if your JSON file is named extensions.json and you want to extract values from the key path, the command would be:

```
./vscode-extension-extractor.mjs extensions.json --key path > extensions.txt
```

The script will read the JSON file, parse its contents, and extract the values for the specified key. It will then print the extracted values to the console.

Note: Make sure to provide the correct file path and key when running the script.
