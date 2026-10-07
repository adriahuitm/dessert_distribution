import type { ReactNode } from 'react';

/**
 * The template's counterpart of the design-kit's `<app-page>` wrapper: one
 * consistent page frame (eyebrow, title, lead, actions, body) so every screen
 * lines up without each page re-inventing its header.
 */
export function AppPage({
    eyebrow,
    title,
    lead,
    actions,
    children,
}: {
    eyebrow?: string;
    title: string;
    lead?: ReactNode;
    actions?: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="page">
            <header className="page-head">
                <div className="page-head-text">
                    {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
                    <h1>{title}</h1>
                    {lead ? <p className="lead">{lead}</p> : null}
                </div>
                {actions ? <div className="page-head-actions">{actions}</div> : null}
            </header>
            <div className="page-body">{children}</div>
        </div>
    );
}
