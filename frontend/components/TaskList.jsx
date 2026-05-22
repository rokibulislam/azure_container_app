'use client';

import Link from 'next/link';

export default function TaskList({ tasks, onComplete, onDelete }) {
  if (!tasks.length) {
    return (
      <div className="card">
        <p className="muted">No tasks yet.</p>
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <div className="card" key={task.id}>
          <div
            className="row"
            style={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <div className="task-title">{task.title}</div>
              {task.description && <p className="muted">{task.description}</p>}
              <div className="task-meta">
                <span className={`badge ${task.status}`}>{task.status}</span>
                {task.due_date && (
                  <span className={`due-date${new Date(task.due_date) < new Date() && task.status !== 'completed' ? ' overdue' : ''}`}>
                    Due {new Date(task.due_date).toLocaleDateString()}
                  </span>
                )}
                {task.attachment_count > 0 && (
                  <span className="muted">{task.attachment_count} attachment{task.attachment_count !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>

            <div className="row">
              {/* ✅ UPDATED LINK */}
              <Link
                className="link"
                href={`/tasks/view?id=${task.id}`}
              >
                View
              </Link>

              {task.status !== 'completed' && (
                <button
                  className="success"
                  onClick={() => onComplete(task.id)}
                >
                  Complete
                </button>
              )}

              <button
                className="danger"
                onClick={() => onDelete(task.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}