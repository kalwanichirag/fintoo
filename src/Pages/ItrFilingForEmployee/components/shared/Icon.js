const ICON_PATHS = {
  calendar: ['M7 3v4', 'M17 3v4', 'M4 8h16', 'M5 5h14v16H5z'],
  lock: ['M7 10V8a5 5 0 0 1 10 0v2', 'M5 10h14v11H5z', 'M12 15v2'],
  check: ['M20 6L9 17l-5-5'],
  x: ['M18 6L6 18', 'M6 6l12 12'],
  shield: ['M12 3l8 3v6c0 5-3.4 8.5-8 9-4.6-.5-8-4-8-9V6z', 'M9 12l2 2 4-5'],
  briefcase: ['M10 6V5a2 2 0 0 1 4 0v1', 'M4 7h16v12H4z', 'M4 12h16'],
  rupee: ['M7 5h10', 'M7 9h10', 'M8 5c6 0 6 8 0 8h-1l8 6'],
  building: ['M4 21V5h10v16', 'M14 9h6v12', 'M8 9h2', 'M8 13h2', 'M8 17h2', 'M17 13h1', 'M17 17h1'],
  bolt: ['M13 2L4 14h7l-1 8 10-13h-7z'],
  file: ['M14 3H6v18h12V7z', 'M14 3v4h4', 'M9 13h6', 'M9 17h4'],
  star: ['M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z'],
  userTie: ['M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M4 21a8 8 0 0 1 16 0', 'M10 14l2 3 2-3'],
  video: ['M4 6h11v12H4z', 'M15 10l5-3v10l-5-3z'],
  clock: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M12 7v6l4 2'],
  folder: ['M3 6h7l2 3h9v10H3z'],
  users: ['M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M3 20a6 6 0 0 1 12 0', 'M17 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z', 'M15 17a5 5 0 0 1 6 3'],
  play: ['M8 5v14l11-7z'],
  arrowLeft: ['M19 12H5', 'M12 19l-7-7 7-7'],
  arrowRight: ['M5 12h14', 'M12 5l7 7-7 7'],
  trophy: ['M8 4h8v3a4 4 0 0 1-8 0z', 'M8 5H5v2a4 4 0 0 0 4 4', 'M16 5h3v2a4 4 0 0 1-4 4', 'M12 11v4', 'M9 21h6', 'M10 15h4'],
  chart: ['M4 19V5', 'M4 19h16', 'M8 15l3-3 3 2 5-7'],
  send: ['M21 3L3 10l8 3 3 8z', 'M11 13l10-10'],
};

export default function Icon({ name, fill = false }) {
  return (
    <svg className={`icon-svg tw-h-[1em] tw-w-[1em] tw-shrink-0 tw-align-[-0.15em]${fill ? ' icon-fill' : ''}`} viewBox="0 0 24 24" aria-hidden="true">
      {(ICON_PATHS[name] || ICON_PATHS.check).map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}
