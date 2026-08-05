#!/bin/bash

# Simple Interest Calculator

echo "Enter the principal:"
read principal

echo "Enter rate of interest per year:"
read rate

echo "Enter time in years:"
read time

simple_interest=$((principal * rate * time / 100))

echo "The simple interest is: $simple_interest"
