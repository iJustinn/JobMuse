import React from "react";

export async function apiGet(path) {
  const response = await fetch(`/api${path}`);
  if (!response.ok) throw new Error(await readError(response));
  return response.json();
}

export async function apiSend(path, { method = "POST", body, etag } = {}) {
  const response = await fetch(`/api${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(etag ? { "If-Match": etag } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) throw new Error(await readError(response));
  return response.json();
}

export function useApiResource(path, options = {}) {
  const [state, setState] = React.useState({
    data: options.initialData || null,
    loading: true,
    error: "",
  });

  const load = React.useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: "" }));
    try {
      const data = await apiGet(path);
      setState({ data, loading: false, error: "" });
      return data;
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: error instanceof Error ? error.message : "Request failed",
      }));
      return null;
    }
  }, [path]);

  React.useEffect(() => {
    load();
  }, [load]);

  React.useEffect(() => {
    if (options.noEvents) return undefined;
    const events = new EventSource("/api/system/events");
    const onChange = () => load();
    events.addEventListener("change", onChange);
    return () => events.close();
  }, [load, options.noEvents]);

  return { ...state, reload: load, setData: (data) => setState({ data, loading: false, error: "" }) };
}

export function useJobEvents(jobId) {
  const [events, setEvents] = React.useState([]);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (!jobId) return undefined;
    setEvents([]);
    setDone(false);
    const source = new EventSource(`/api/jobs/${jobId}/events`);
    const append = (type) => (event) => {
      const data = parseEventData(event.data);
      setEvents((items) => [...items, { type, data, at: new Date().toISOString() }]);
    };
    source.addEventListener("log", append("log"));
    source.addEventListener("stdout", append("stdout"));
    source.addEventListener("stderr", append("stderr"));
    source.addEventListener("progress", append("progress"));
    source.addEventListener("done", (event) => {
      append("done")(event);
      setDone(true);
      source.close();
    });
    source.addEventListener("error", (event) => {
      if (event.data) append("error")(event);
      setDone(true);
      source.close();
    });
    return () => source.close();
  }, [jobId]);

  return { events, done };
}

function parseEventData(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

async function readError(response) {
  try {
    const data = await response.json();
    return data.error || `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}
