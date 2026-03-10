import ProjectItem from "@/components/ProjectItem";
import { longFormProjects, shortFormToys } from "@/content/projects/data";
import { ShootingStarCursor } from "@/components/shooting-star-cursor";

export default function WorkPage() {
  return (
    <div className="min-h-screen background py-12 px-4">
      <ShootingStarCursor />
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Left Column: Projects */}
          <section>
            <div className="flex items-baseline gap-2 mb-8">
              <h2 className="text-lg font-bold font-bianzhidai">projects</h2>
              <span className="text-sm font-fe font-bold opacity-70 italic">long form</span>
            </div>
            <div>
              {longFormProjects.map((p) => (
                <ProjectItem key={p.id} project={p} />
              ))}
            </div>
          </section>

          {/* Right Column: Toys */}
          <section>
            <div className="flex items-baseline gap-2 mb-8">
              <h2 className="text-lg font-bold font-bianzhidai">toys</h2>
              <span className="text-sm font-fe font-bold opacity-70 italic">short form experiments</span>
            </div>
            <div>
              {shortFormToys.map((p) => (
                <ProjectItem key={p.id} project={p} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
