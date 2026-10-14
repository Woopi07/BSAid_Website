import Icon from './Icons.jsx';

export default function PanelHeader({ icon, title, subtitle }) {
  return (
    <div className="flex shrink-0 items-center gap-4 rounded-2xl bg-ep-cream p-5 shadow-sm ring-1 ring-ep-line sm:p-6">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ep-amber text-ep-navy shadow-[0_4px_0_#B45309]">
        <Icon name={icon} className="h-7 w-7" />
      </span>
      <div className="min-w-0">
        <h1 className="font-rounded text-2xl font-black text-ep-ink sm:text-3xl">{title}</h1>
        <p className="mt-1 inline-block border-b-2 border-dashed border-ep-amber pb-0.5 font-rounded text-sm font-bold text-orange-600 sm:text-base">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
