// src/components/SortableTable.jsx
import React from "react";

export function SortTh({ label, title, sortKey, defaultDir, sortState, setSortState, }) {
    const isActive = sortState.key === sortKey;
    const isDesc = sortState.dir === "desc";

    // Donne prochain State de sort
    function handleClick() {
        if (!sortKey) return;
        if (isActive) {
            const isFirstDir = sortState.dir === (defaultDir ?? "desc");
            if (isFirstDir) {
                setSortState({ key: sortKey, dir: defaultDir === "asc" ? "desc" : "asc" });
            } else {
                setSortState({ key: null, dir: "desc" });
            }
        } else {
            setSortState({ key: sortKey, dir: defaultDir ?? "desc" });
        }
    }

    return (
        <th
            onClick={handleClick}
            className={`${sortKey ? "sortable-th" : ""} ${isActive ? "active-sort" : ""}`}
        >
            <abbr title={title}>{label}</abbr>
            {sortKey && (
                <span className="sort-icon">{isActive ? (isDesc ? " ↓" : " ↑") : " ↕"}</span>
            )}
        </th>
    );
}

export function SortableTable({ cols, rows, sortState, setSortState, rowKey, playerKey = "id", playerLabel }) {
    return (
        <div className="table-wrapper">
            <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        {/* Colonnes selon données */}
                        {cols.map((col) => (
                            <SortTh
                                key={col.label}
                                label={col.label}
                                title={col.title}
                                sortKey={col.key}
                                defaultDir={col.defaultDir}
                                sortState={sortState}
                                setSortState={setSortState}
                            />
                        ))}
                    </tr>
                </thead>
                {/* Lignes selon données */}
                <tbody>
                    {rows.map((player) => (
                        <tr key={player[rowKey]}>
                            {cols.map((col) => (
                                <td
                                    key={col.label}
                                    className={sortState.key === col.key ? "active-sort-col" : ""}
                                >
                                    {col.render(player)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
