const io = require("socket.io-client")
const assert = require("assert")
const { inspect } = require("util")
const readline = require("readline")

function log(...args) {
  process.stdout.write(
    args
      .map((x) => {
        assert.equal(typeof x, "string")
        assert.equal(x.indexOf("\n"), -1)
        assert.equal(x.indexOf("\t"), -1)
        return x
      })
      .join("\t") + "\n"
  )
}

function main() {
  const uri = process.argv[2]
  if (typeof uri != "string") {
    console.error(`Usage: ${process.argv[0]} ${process.argv[1]} URI`)
    process.exit(1)
  }
  const socket = io(uri, { autoConnect: false })
  setupInput(socket)
  setupOutput(socket)
}

function setupOutput(socket) {
  socket.on("connect", () => {
    log("connect")
  })

  socket.on("disconnect", (reason) => {
    log("disconnect", reason)
  })

  socket.on("connect_error", (error) => {
    log("connect_error", JSON.stringify(error))
  })

  // data events
  socket.onAny((eventName, ...args) => {
    log("event", eventName, ...args.map(JSON.stringify))
  })
}

function setupInput(socket) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "",
  })

  rl.on("line", (line) => {
    const [command, ...args] = line.split("\t")
    switch (command) {
      case "connect":
        socket.connect()
        break
      case "disconnect":
        socket.disconnect()
        break
      case "emit":
        assert.equal(typeof args[0], "string")
        socket.emit(args[0], ...args.slice(1).map(JSON.parse))
        break
      default:
        throw Error("Invalid command: " + command)
    }
  })
}

if (require.main === module) main()