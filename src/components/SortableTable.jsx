// src/components/SortableTable.jsx
import React from "react";

function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function SortTh({ label, title, sortKey, defaultDir, sortState, setSortState, className }) {
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
            className={`${sortKey ? "sortable-th" : ""} ${isActive ? "active-sort" : ""} ${className ?? ""}`}
        >
            <abbr title={title}>{label}</abbr>
            {sortKey && (
                <span className="sort-icon">{isActive ? (isDesc ? " ↓" : " ↑") : ""}</span>
            )}
        </th>
    );
}

export function SortableTable({ cols, rows, sortState, setSortState, rowKey, rankKey, className }) {
    const sortedRows = React.useMemo(() => {
        if (!sortState.key) return rows;

        const activeCol = cols.find((col) => col.key === sortState.key);

        return [...rows].sort((a, b) => {
            // Custom sorter takes priority
            if (activeCol?.sorter) {
                const result = activeCol.sorter(a, b);
                // Respect sort direction (flip if user clicked to reverse)
                return sortState.dir === (activeCol.defaultDir ?? "desc") ? result : -result;
            }

            // Default: sort by key value
            const aVal = getNestedValue(a, sortState.key);
            const bVal = getNestedValue(b, sortState.key);
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            return sortState.dir === "desc" ? bVal - aVal : aVal - bVal;
        });
    }, [rows, sortState, cols]);

    return (
        <div className="table-wrapper">
            <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        {cols.map((col) => (
                            <SortTh
                                key={col.label}
                                className={col.className}
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
                <tbody>
                    {sortedRows.map((row) => (
                        <tr key={getNestedValue(row, rowKey)}>
                            {cols.map((col) => (
                                <td
                                    key={col.label}
                                    className={`${sortState.key === col.key ? "active-sort-col" : ""} ${className ?? ""}`}
                                >
                                    {col.render(row, rankKey)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
