import { redirect } from "next/navigation";

// Redirect /projects to /work for backwards compatibility
export default function ProjectsPage() {
  redirect("/work");
}
