#!/bin/sh

# Check if the operating system is macOS
[[ $(uname) == "Darwin" ]] || {
  echo "This script is intended for macOS only. Exiting."
  exit 1
}

# Get the current working directory
cwd=$(pwd)

# Get the display width and height
display_width=1920
display_height=1080

# Calculate the terminal width and height
terminal_height=$((display_height / 3))
terminal_width=$((display_width / 3))
margin=25

# Run all the executors
i=1
for file in ./executors/*.reserve.exec.mjs; do
    x_position=$(((i % 3) * (terminal_width)))
    y_position=$((25 + (i / 3) * (terminal_height)))

    # Open a new Terminal window and run the executor
    osascript -e "tell application \"Terminal\" to do script \"cd $cwd && node $file\""

    # Introduce a delay before setting dimensions to allow the window to activate
    sleep 1

    # Set dimensions and position of the Terminal window
    osascript -e "tell application \"Terminal\" to set bounds of front window to {$x_position, $y_position, $((x_position + terminal_width)), $((y_position + terminal_height - margin))}"

    i=$((i + 1))
done
