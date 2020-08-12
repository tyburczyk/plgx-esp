import { schema } from "nexus";

schema.objectType({
  name: "KillChainPhase",
  description: "The kill-chain-phase represents a phase in a kill chain.",
  definition(t) {
    t.string("kill_chain_name", { description: "The name of the kill chain." });
    t.string("phase_name", {
      description: "The name of the phase in the kill chain."
    });
  }
});
