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
              <p className="muted">{task.description || 'No description'}</p>
              <div className={`badge ${task.status}`}>{task.status}</div>
              <p className="muted">
                Attachments: {task.attachment_count}
              </p>
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