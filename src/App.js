import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

const sortingAlgorithms = {
  Bubble: {
    sort: (arr) => {
      let a = [...arr];
      for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a.length - i - 1; j++) {
          if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
        }
      }
      return a;
    },
    complexity: {
      best: "O(n)",
      average: "O(n^2)",
      worst: "O(n^2)",
    },
  },
  Selection: {
    sort: (arr) => {
      let a = [...arr];
      for (let i = 0; i < a.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < a.length; j++) {
          if (a[j] < a[minIdx]) minIdx = j;
        }
        [a[i], a[minIdx]] = [a[minIdx], a[i]];
      }
      return a;
    },
    complexity: {
      best: "O(n^2)",
      average: "O(n^2)",
      worst: "O(n^2)",
    },
  },
  Insertion: {
    sort: (arr) => {
      let a = [...arr];
      for (let i = 1; i < a.length; i++) {
        let key = a[i];
        let j = i - 1;
        while (j >= 0 && a[j] > key) {
          a[j + 1] = a[j];
          j--;
        }
        a[j + 1] = key;
      }
      return a;
    },
    complexity: {
      best: "O(n)",
      average: "O(n^2)",
      worst: "O(n^2)",
    },
  },
  Merge: {
    sort: (arr) => {
      if (arr.length <= 1) return arr;
      const mid = Math.floor(arr.length / 2);
      const left = sortingAlgorithms.Merge.sort(arr.slice(0, mid));
      const right = sortingAlgorithms.Merge.sort(arr.slice(mid));
      return merge(left, right);
    },
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
    },
  },
  Quick: {
    sort: (arr) => {
      if (arr.length <= 1) return arr;
      const pivot = arr[arr.length - 1];
      const left = [],
        right = [];
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) left.push(arr[i]);
        else right.push(arr[i]);
      }
      return [
        ...sortingAlgorithms.Quick.sort(left),
        pivot,
        ...sortingAlgorithms.Quick.sort(right),
      ];
    },
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n^2)",
    },
  },
};

function merge(left, right) {
  const result = [];
  while (left.length && right.length) {
    result.push(left[0] < right[0] ? left.shift() : right.shift());
  }
  return [...result, ...left, ...right];
}

function parseInput(input) {
  return input
    .split(",")
    .map((n) => parseInt(n.trim()))
    .filter((n) => !isNaN(n));
}

function generateRandomArray(length = 10, min = 1, max = 1000) {
  const arr = Array.from({ length }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
  return arr.join(", ");
}

function classifyInputCase(arr, algoName) {
  const isSorted = arr.every((val, i, a) => i === 0 || a[i - 1] <= val);
  const isReverseSorted = arr.every((val, i, a) => i === 0 || a[i - 1] >= val);

  switch (algoName) {
    case "Bubble":
    case "Insertion":
      if (isSorted) return "Best";
      if (isReverseSorted) return "Worst";
      return "Average";
    case "Selection":
    case "Merge":
      return "Average (fixed time)";
    case "Quick":
      if (isSorted || isReverseSorted) return "Worst";
      return "Best/Average (random pivot)";
    default:
      return "Unknown";
  }
}

export default function App() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [len, setArrayLen] = useState("");

  const handleSort = () => {
    const output = [];
    let arr = [];
    if (input === "") {
      arr = parseInput(generateRandomArray());
    }
    else {
      arr = parseInput(input);
    }

    Object.entries(sortingAlgorithms).forEach(([name, algo]) => {
      const CurrentCase = classifyInputCase(arr, name);
      const start = performance.now();
      const sorted = algo.sort(arr);
      const end = performance.now();
      output.push({
        name,
        time: +(end - start).toFixed(3),
        CurrentCase: CurrentCase,
        sorted: sorted.join(", "),
        ...algo.complexity,
      });
    });

    setResults(output);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-blue-400">
          Sorting Algorithm Visualizer
        </h1>
        <div className="flex justify-center">
          <p className="text-xl font-semibold">Enter Raw Input</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            className="flex-1 p-3 rounded bg-gray-800 border border-gray-600"
            placeholder="Enter numbers (e.g., 8, 3, 5, 1)"
            value={input}
            onChange={(e) => { setInput(e.target.value); setArrayLen("") }}
          />
          <button
            onClick={handleSort}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white font-semibold"
          >
            Analyze
          </button>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xl font-semibold flex justify-center mb-5">OR</p>
          <div className="grid md:grid-cols-2 grid-cols-1 justify-center gap-5">
            <input
              type="text"
              className="w-auto p-3 rounded bg-gray-800 border border-gray-600"
              placeholder="Enter length of array max 10,000 default 10"
              value={len}
              onChange={(e) => setArrayLen(e.target.value)}
            />
            <button
              onClick={() => setInput(generateRandomArray(len ? len : 10))}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white font-semibold"
            >
              Generate Random Data
            </button>
          </div>
        </div>

        {results.length <= 0 && (
          <>
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg space-y-6">
              <h2 className="text-3xl font-bold text-blue-400 text-center">Sorting Algorithms Overview</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-semibold text-blue-300">Bubble Sort</h3>
                  <p className="text-gray-300">
                    Bubble Sort is a simple comparison-based algorithm. It repeatedly steps through the list,
                    compares adjacent elements and swaps them if they are in the wrong order. It's not suitable for
                    large datasets due to its quadratic time complexity.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-blue-300">Selection Sort</h3>
                  <p className="text-gray-300">
                    Selection Sort divides the array into a sorted and unsorted part. It repeatedly selects the minimum
                    element from the unsorted part and moves it to the sorted part. It always makes the same number of comparisons,
                    regardless of the input.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-blue-300">Insertion Sort</h3>
                  <p className="text-gray-300">
                    Insertion Sort builds the final sorted array one item at a time. It is more efficient than most simple
                    quadratic algorithms for small datasets or nearly sorted data.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-blue-300">Merge Sort</h3>
                  <p className="text-gray-300">
                    Merge Sort is a divide-and-conquer algorithm that splits the array into halves, recursively sorts them,
                    and then merges the sorted halves. It has consistent performance with O(n log n) time complexity.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-blue-300">Quick Sort</h3>
                  <p className="text-gray-300">
                    Quick Sort is another divide-and-conquer algorithm. It picks a pivot, partitions the array around the pivot,
                    and recursively sorts the partitions. It's very fast on average but has a worst-case time complexity of O(n^2)
                    if a bad pivot is consistently chosen.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}


        {results.length > 0 && (
          <>
            <div className="bg-gray-800 p-6 rounded">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={results}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="time" fill="#60a5fa">
                    <LabelList dataKey="time" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-400 text-center mt-2">
                Time in milliseconds (ms)
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-8 w-[60vw] overflow-auto">
              {results.map(({ name, time, CurrentCase, best, average, worst, sorted }) => (
                <div key={name} className="bg-gray-800 p-4 rounded shadow-md">
                  <h3 className="text-xl font-bold text-blue-300 mb-2">
                    {name} Sort
                  </h3>
                  <p>
                    <span className="text-green-400">Time:</span> {time} ms
                  </p>
                  <p>
                    <span className="text-yellow-400">Case:</span> {CurrentCase}
                  </p>
                  <p>
                    <span className="text-yellow-400">Best:</span> {best}
                  </p>
                  <p>
                    <span className="text-yellow-400">Avg:</span> {average}
                  </p>
                  <p>
                    <span className="text-red-400">Worst:</span> {worst}
                  </p>
                  <p className="mt-2 text-sm text-gray-300">
                    Sorted: <span className="break-words">{sorted}</span>
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
