# GoOut ZJDC automated seat reservation

> Automated seat reservation for GoOut portal with optimization for ZJDC theatre.

## Requirements 

Node.js 18 is required to run this project.

## Installation

To install all dependencies run:

```sh
npm install
```

## How to use

1. List all events for specific artist and save its output to file (e.g. `temp/list.json`):

```sh
 npm run list -- --artist-name=divadlo-jary-cimrman --artist-code=pzfnuvf --number-of-seats-to-reserve=2 --prioritization-file=prioritization/zjdc.1.json
 ```

2. Create reservation executors for specific event based on list file from previous step and number of seats to reserve:

```sh
npm run createReserveExecutors -- --list-file=temp/list.json
```

3. Run reservation executors created in previous step (currently implemented for MacOS only):

```sh
 npm run runReserveExecutors
 ```

or run specific reservation executor:

```sh
node executors/<name>.reserve.exec.mjs
 ```

## Interaction using CLI

When executor is running, you can interact with it using CLI. You can use following key combinations to:

* `CTRL + C` - stop the executor
* `R` - reload the executor (in case that seats are pre-reserved, browser with such instance should stay opened and new browser should be started for new instance)
