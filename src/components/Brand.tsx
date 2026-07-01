import { ToolbeltLockup } from '@/components/marketing/ToolbeltLockup';

/**
 * App brand mark. Renders the same "Toolbelt, by Crewcraft" lockup used on the
 * marketing site so the name is identical across every page. `showWord=false`
 * drops the "by Crewcraft" endorsement (tight spots).
 */
export function Brand({ className, showWord = true }: { className?: string; showWord?: boolean }) {
  return <ToolbeltLockup className={className} endorse={showWord} />;
}
