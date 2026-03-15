import { useState } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

type ListType = "singly" | "doubly";

const defaults: Record<ListType, number[]> = {
  singly: [10, 20, 30, 40],
  doubly: [15, 25, 35, 45],
};

export default function LinkedList() {
  const [listType, setListType] = useState<ListType>("singly");
  const [nodes, setNodes] = useState<number[]>(defaults.singly);
  const [value, setValue] = useState("25");
  const [target, setTarget] = useState("30");
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("Singly linked list: each node stores a value and a next pointer.");
  const [speed, setSpeed] = useState(5);

  const code = `class SinglyNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class DoublyNode {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}`;

  const metrics = {
    head: nodes.length ? nodes[0] : "-",
    tail: nodes.length ? nodes[nodes.length - 1] : "-",
    size: nodes.length,
  };

  const resetByType = (type: ListType) => {
    setListType(type);
    setNodes(defaults[type]);
    setValue(type === "singly" ? "25" : "55");
    setTarget(type === "singly" ? "30" : "35");
    setHighlightIndex(null);
    setMessage(
      type === "singly"
        ? "Singly linked list: each node stores a value and a next pointer."
        : "Doubly linked list: each node stores both prev and next pointers.",
    );
  };

  const parseValue = (raw: string) => {
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const handleAppend = () => {
    const parsed = parseValue(value);
    if (parsed === null) {
      setMessage("Enter a valid number before appending.");
      return;
    }

    const nextNodes = [...nodes, parsed];
    setNodes(nextNodes);
    setHighlightIndex(nextNodes.length - 1);
    setMessage(
      listType === "singly"
        ? `Append ${parsed}: traverse to the tail and wire the previous tail's next pointer.`
        : `Append ${parsed}: attach it after the tail and update both prev and next links.`,
    );
    setValue("");
  };

  const handlePrepend = () => {
    const parsed = parseValue(value);
    if (parsed === null) {
      setMessage("Enter a valid number before prepending.");
      return;
    }

    setNodes((current) => [parsed, ...current]);
    setHighlightIndex(0);
    setMessage(
      listType === "singly"
        ? `Prepend ${parsed}: point the new head to the old head.`
        : `Prepend ${parsed}: point new head.next to the old head and old head.prev back to the new head.`,
    );
    setValue("");
  };

  const handleDelete = () => {
    const parsed = parseValue(target);
    if (parsed === null) {
      setMessage("Enter a valid number to delete.");
      return;
    }

    const index = nodes.indexOf(parsed);
    if (index === -1) {
      setMessage(`${parsed} is not present in the ${listType} list.`);
      setHighlightIndex(null);
      return;
    }

    setNodes((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setHighlightIndex(null);
    setMessage(
      listType === "singly"
        ? `Delete ${parsed}: bypass node ${index} by wiring the previous node directly to the next node.`
        : `Delete ${parsed}: reconnect both prev and next neighbors around node ${index}.`,
    );
  };

  const handleSearch = () => {
    const parsed = parseValue(target);
    if (parsed === null) {
      setMessage("Enter a valid number to search.");
      return;
    }

    const index = nodes.indexOf(parsed);
    setHighlightIndex(index === -1 ? null : index);
    setMessage(
      index === -1
        ? `${parsed} is not in the ${listType} list.`
        : `${listType === "singly" ? "Traverse next pointers" : "Walk through linked prev/next pointers"} and stop at node ${index}.`,
    );
  };

  const renderNodes = (type: ListType) => (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex min-h-[220px] min-w-max items-center gap-4">
        {nodes.map((node, index) => (
          <div key={`${type}-${node}-${index}`} className="flex items-center gap-3">
            {type === "doubly" ? (
              <div className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-500">
                {index === 0 ? "Null" : "Prev"}
              </div>
            ) : null}

            <div
              className={`min-w-32 rounded-3xl border px-5 py-5 text-center ${
                highlightIndex === index
                  ? "border-cyan-500 bg-cyan-500 text-slate-950 shadow-lg"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.24em] opacity-70">Node {index}</p>
              <p className="mt-2 text-2xl font-semibold">{node}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] opacity-70">
                {type === "singly" ? "next" : "prev | next"}
              </p>
            </div>

            <div className="flex items-center gap-2 text-3xl text-slate-400">
              {type === "doubly" ? "↔" : "→"}
            </div>
          </div>
        ))}

        {nodes.length ? (
          <div className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-500">
            Null
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-8 text-sm text-slate-500">
            Empty list
          </div>
        )}
      </div>
    </div>
  );

  return (
    <AlgorithmLayout
      title="Linked List"
      isPlaying={false}
      onPlay={handleSearch}
      onPause={() => undefined}
      onReset={() => resetByType(listType)}
      speed={speed}
      onSpeedChange={setSpeed}
      complexity={{ time: "O(n)", space: "O(n)" }}
      description="Compare singly and doubly linked lists. Both tabs support append, prepend, delete, and search while explaining which pointers change at each operation."
      code={code}
    >
      <div className="space-y-6">
        <Tabs
          value={listType}
          onValueChange={(value) => resetByType(value as ListType)}
          className="space-y-6"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 rounded-2xl bg-slate-200 p-1">
            <TabsTrigger value="singly" className="rounded-xl">Singly Linked List</TabsTrigger>
            <TabsTrigger value="doubly" className="rounded-xl">Doubly Linked List</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap gap-3">
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Node value"
              className="max-w-xs"
            />
            <Button onClick={handleAppend}>Append</Button>
            <Button variant="outline" onClick={handlePrepend}>Prepend</Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Input
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              placeholder="Search / delete target"
              className="max-w-xs"
            />
            <Button variant="outline" onClick={handleSearch}>Search</Button>
            <Button variant="outline" onClick={handleDelete}>Delete</Button>
          </div>

          <TabsContent value="singly" className="space-y-6">
            {renderNodes("singly")}
          </TabsContent>

          <TabsContent value="doubly" className="space-y-6">
            {renderNodes("doubly")}
          </TabsContent>
        </Tabs>

        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
          {message}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">List Type</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">
              {listType === "singly" ? "Singly" : "Doubly"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Head</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{metrics.head}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Tail</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{metrics.tail}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Size</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{metrics.size}</p>
          </div>
        </div>
      </div>
    </AlgorithmLayout>
  );
}
