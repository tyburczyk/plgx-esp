import { schema } from "nexus";

schema.objectType({
  name: "GranularMarking",
  description:
    "The granular-marking type defines how the list of marking-definition objects\nreferenced by the marking_refs property to apply to a set of content identified\nby the list of selectors in the selectors property.",
  definition(t) {
    t.list.string("selectors", {
      description:
        "A list of selectors for content contained within the STIX object in which this property appears."
    });
    t.string("lang", {
      nullable: true,
      description:
        "Identifies the language of the text identified by this marking."
    });
    t.field("marking", {
      type: "MarkingDefinition",
      description:
        "Represents identifiers across the CTI specifications. The format consists of\nthe name of the top-level object being identified, followed by two dashes\n(--), followed by a UUIDv4."
    });
  }
});
