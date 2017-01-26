import React from "react";
import { connect } from "./store";
import { TextInput } from "./utils";

const RenameField = connect((
  { store: { panx, renameOpen, rename, scale, cancelAll } }
) =>
  {
    if (!renameOpen) {
      return null;
    }
    const left = 152 + (renameOpen.x * scale - panx * 4 * scale);
    return (
      <div
        style={
          {
            position: "fixed",
            left: `${left}px`,
            top: `${renameOpen.y + 33}px`
          }
        }
      >
        <TextInput
          value={renameOpen.title}
          onSubmit={x => renameOpen.rename(x)}
          onCancel={cancelAll}
        />
      </div>
    );
  });

export default RenameField;
