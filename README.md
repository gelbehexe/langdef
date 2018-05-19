# langdef

Converts *.langdef files to *.xlf language files

## Install

```
$ npm install @gelbehexe/langdef
```
 
## Usage

### Function

```js
const Langdef = require('../');
Langdef({
	"source": __dirname+'/sample.langdef',
	"dest": __dirname+'/out',
	"hideDefault": false
})
	.then(function (res) {
		console.log(`Processed file "${res}"`);
	},function(err) {
		console.error(err);
	});
```

### Terminal
```bash
langdef -t t3 -s /path/to/langdef/messages.langdef -d /tmp
```

### Options
|name|description|default|
|---|---|---|
|`source`|source file '*.langdef' (required)|*empty*|
|`dest`|dest path or file without extension (relative to source path or absolute)|*empty*|
|`type`|Type of environment|*empty*|
|`hideDefault`|Hide key for default language in filename|true|
|`defaultLocale`|Set the default locale key|'en'|
|`pos`|Position of the locale key in file name <append&#124;prepend>|'append'|
|`namespace`|Namespace attribute for xliff tag|*empty*|
|`copyFileAttributes`|Whether to copy the original attributes from file tag or not |true|
|`extraFileAttrs`|File attributes to add to file tag (e.g. "attr1=value1;attr2=value2" for console, otherwise use js object|*empty*|
|`xliffVersion`|xliff version to use|1.0|
|`header`|Whether to insert an empty header or not|true|
|`extension`|Extension for target files|'xlf'|
|`useIdForSource`|Whether to use id for source or not|false|
|`noDate`|No date in filetag|true|
|`addSourceLang`|Whether to add a 'source-language' attribute or not|false|
|`addTargetLang`|Whether to add a 'target-language' attribute or not|false|
|`forceTarget`|Whether to always add 'target' entry or not|false|

#### Options for cli-only

Show all options by using the help argument:
```bash
langdef --help
```

## 'langdef' format
Once upon the day, while I was working silently in my chamber as a TYPO3 Developer, the xlf language file format was introduced. I fount it quite complex to manage different files for each language. 

So I created the 'langdef' format for my work and a parser to convert it to xlf format.

Here is a small example:  

```xml
<?xml version="1.0" encoding="UTF8" standalone="yes"?>
<langDef>
	<file datatype="plaintext" original="messages" product-name="demo">
		<entry id="sampleLLKey">
			<source>english</source>
			<translations>
				<de>deutsch</de>
				<fr>allemand</fr>
			</translations>
		</entry>
		<entry id="folder">
			<source>folder</source>
			<translations>
				<de>Verzeichnis</de>
				<fr>annuaire</fr>
			</translations>
		</entry>
		<entry id="hello_goodbye">
			<source><![CDATA[Hello & Good Bye]]></source>
			<translations>
				<de><![CDATA[Hallo & Auf Wiedersehen]]></de>
				<fr><![CDATA[Bonjour & au revoir]]></fr>
			</translations>
		</entry>
		<entry id="html_greeting">
			<source><![CDATA[Hello <strong>World</strong>]]></source>
			<translations>
				<de><![CDATA[Hallo <strong>Welt</strong>]]></de>
				<fr><![CDATA[Bonjour <strong>Monde</strong>]]></fr>
			</translations>
		</entry>
		<entry id="only_english">
			<source>Only English</source>
		</entry>
		<entry id="only_german">
			<source>Only German</source>
			<translations>
				<de>Nur deutsch</de>
			</translations>
		</entry>
	</file>
</langDef>
```
### Description
Root tag must be `langdef`.
The `<file>` tag is the first child and is also present in target xlf file. You can use the option `copyFileAttributes` to adjust 
whether to copy its attributes to target file or not.
There can be multiple `entry` tags. Each entry represents an entry in the target language file.

#### `entry`

Each Entry must have a per file unique `id` tag. Duplicate entries are triggering warnings and only the last one is used.
The first subtag must be a `source` tag, optionally followed by a `translation` tag.
Each `translation` tag may or may not contain a per entry unique language shortcut like `de`, `fr`, `pl`, which are represantating
the target languages.
For each target language a target file is created.

You may not enumerate all target languages in all entries.
