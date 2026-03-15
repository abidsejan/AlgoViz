import { useState } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function Stack() {
  const [stack, setStack] = useState<number[]>([12, 24, 36]);
  const [value, setValue] = useState("48");
  const [highlight, setHighlight] = useState<number | null>(stack.length - 1);
  const [message, setMessage] = useState("Top of the stack is highlighted.");
  const [speed, setSpeed] = useState(5);

  const code = `class Stack {
  constructor() {
    this.items = [];
  }

  push(value) {
    this.items.push(value);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }
}`;

  const updateHighlight = (nextStack: number[]) => {
    setHighlight(nextStack.length ? nextStack.length - 1 : null);
  };

  const handlePush = () => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      setMessage("Enter a valid number before pushing.");
      return;
    }

    const nextStack = [...stack, parsed];
    setStack(nextStack);
    updateHighlight(nextStack);
    setMessage(`Pushed ${parsed} onto the stack.`);
    setValue("");
  };

  const handlePop = () => {
    if (!stack.length) {
      setMessage("Stack underflow: nothing to pop.");
      return;
    }

    const removed = stack[stack.length - 1];
    const nextStack = stack.slice(0, -1);
    setStack(nextStack);
    updateHighlight(nextStack);
    setMessage(`Popped ${removed} from the stack.`);
  };

  const handlePeek = () => {
    if (!stack.length) {
      setMessage("Stack is empty.");
      setHighlight(null);
      return;
    }

    updateHighlight(stack);
    setMessage(`Peek returns ${stack[stack.length - 1]}.`);
  };

  return (
    <AlgorithmLayout
      title="Stack"
      isPlaying={false}
      onPlay={handlePeek}
      onPause={() => undefined}
      onReset={() => {
        setStack([12, 24, 36]);
        setValue("48");
        setHighlight(2);
        setMessage("Stack reset to the default demo values.");
      }}
      speed={speed}
      onSpeedChange={setSpeed}
      complexity={{ time: "O(1)", space: "O(n)" }}
      description="A stack follows Last-In, First-Out order. Use push, pop, and peek to see how the top changes."
      code={code}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Value to push"
            className="max-w-xs"
          />
          <Button onClick={handlePush}>Push</Button>
          <Button variant="outline" onClick={handlePop}>Pop</Button>
          <Button variant="outline" onClick={handlePeek}>Peek</Button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="mx-auto flex min-h-[320px] max-w-xs flex-col-reverse items-stretch justify-start gap-3 rounded-[2rem] border-4 border-slate-900 bg-white p-4">
            {stack.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className={`rounded-2xl border px-4 py-4 text-center text-lg font-semibold transition ${
                  highlight === index
                    ? "border-cyan-500 bg-cyan-500 text-slate-950 shadow-lg"
                    : "border-slate-200 bg-slate-100 text-slate-700"
                }`}
              >
                {item}
              </div>
            ))}
            {!stack.length ? (
              <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                Empty stack
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Top</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {stack.length ? stack[stack.length - 1] : "-"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Size</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{stack.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Status</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{message}</p>
          </div>
        </div>
      </div>
    </AlgorithmLayout>
  );
}
