import type ChangeDocument from "@/types/change-document"

// Helper function to map our existing ticket data to the ChangeDocument interface
export function mapTicketToChangeDocument(ticket: any): ChangeDocument {
  return {
    _id: ticket.ticketId,
    change_number: ticket.ticketId,
    server: "gerrit.example.com",
    rdc: {
      key: ticket.rdcTask || "",
      url: ticket.links?.gerrit || "#",
      title: ticket.title || "",
    },
    current_patchset: 1,
    repository: ticket.repository || "",
    branch: ticket.branch || "",
    status: mapTicketStatusToChangeStatus(ticket.status),
    owner: {
      id: "user-" + (ticket.submitter || "unknown").toLowerCase().replace(/\s/g, "-"),
      name: ticket.submitter || "Unknown",
      email: `${ticket.submitter?.toLowerCase().replace(/\s/g, ".")}@example.com` || "unknown@example.com",
    },
    refs_spec: `refs/changes/${ticket.ticketId.slice(-2)}/${ticket.ticketId}/1`,
    topic: ticket.branch || "",
    created_at: new Date(ticket.submitTime || Date.now()),
    updated_at: new Date(Date.now()),
    merged_at: ticket.status === "success" ? new Date(Date.now() - 86400000) : undefined,
    patchsets: [
      {
        number: 1,
        commit_id: ticket.commitId || "",
        created_at: new Date(ticket.submitTime || Date.now()),
        status: mapTicketStatusToPatchsetStatus(ticket.status),
      },
    ],
    ci_type: ticket.ciType || "",
    current_state: {
      ci_status: mapTicketStatusToCiStatus(ticket.status),
      test_status: mapTicketStatusToTestStatus(ticket.status),
    },
    votes: (ticket.reviewers || []).map((reviewer: any) => ({
      type: "Code-Review",
      user: reviewer.name,
      time: new Date(Date.now() - Math.floor(Math.random() * 86400000)),
      mark: Number.parseInt(reviewer.score.replace(/[^0-9-+]/g, "")) || 0,
    })),
    total_ci:
      ticket.projects?.flatMap((project: any) =>
        project.steps
          .filter((step: any) => step.name.includes("编译") || step.name.includes("构建"))
          .map((step: any) => ({
            job_name: `${project.name}-${step.name}`,
            job_type: ticket.ciType || "",
            id: `ci-${project.id}-${step.name.replace(/\s/g, "-")}`,
            build_num: Math.floor(Math.random() * 1000) + 1000,
            build_ret: mapStepStatusToBuildResult(step.status),
            job_url: "#",
            project_id: project.id,
            project_name: project.name,
          })),
      ) || [],
    total_test:
      ticket.projects?.flatMap((project: any) =>
        project.steps
          .filter((step: any) => step.name.includes("测试"))
          .map((step: any) => ({
            id: `test-${project.id}-${step.name.replace(/\s/g, "-")}`,
            job_name: `${project.name}-${step.name}`,
            build_num: Math.floor(Math.random() * 1000) + 1000,
            job_url: "#",
            build_ret: mapStepStatusToBuildResult(step.status),
            project_id: project.id,
            project_name: project.name,
          })),
      ) || [],
    summary: {
      total_ci_runs:
        ticket.projects?.reduce(
          (acc: number, project: any) =>
            acc + project.steps.filter((step: any) => step.name.includes("编译") || step.name.includes("构建")).length,
          0,
        ) || 0,
      total_test_runs:
        ticket.projects?.reduce(
          (acc: number, project: any) => acc + project.steps.filter((step: any) => step.name.includes("测试")).length,
          0,
        ) || 0,
      latest_ci_job_id: `ci-latest-${Math.floor(Math.random() * 10000)}`,
      latest_test_id: `test-latest-${Math.floor(Math.random() * 10000)}`,
      days_open: Math.floor(Math.random() * 10) + 1,
    },
  }
}

// Helper functions to map statuses
function mapTicketStatusToChangeStatus(status: string): string {
  switch (status) {
    case "success":
      return "MERGED"
    case "failed":
      return "ACTIVE"
    case "running":
      return "ACTIVE"
    case "waiting":
    case "pending":
      return "ACTIVE"
    default:
      return "ACTIVE"
  }
}

function mapTicketStatusToPatchsetStatus(status: string): string {
  switch (status) {
    case "success":
      return "MERGED"
    case "failed":
      return "FAILED"
    case "running":
      return "RUNNING"
    case "waiting":
    case "pending":
      return "PENDING"
    default:
      return "PENDING"
  }
}

function mapTicketStatusToCiStatus(status: string): string {
  switch (status) {
    case "success":
      return "SUCCESS"
    case "failed":
      return "FAILED"
    case "running":
      return "RUNNING"
    case "waiting":
    case "pending":
      return "PENDING"
    default:
      return "PENDING"
  }
}

function mapTicketStatusToTestStatus(status: string): string {
  switch (status) {
    case "success":
      return "SUCCESS"
    case "failed":
      return "FAILED"
    case "running":
      return "RUNNING"
    case "waiting":
    case "pending":
      return "PENDING"
    default:
      return "PENDING"
  }
}

function mapStepStatusToBuildResult(status: string): string {
  switch (status) {
    case "success":
      return "SUCCESS"
    case "failed":
      return "FAILED"
    case "running":
      return "RUNNING"
    case "waiting":
    case "pending":
      return "PENDING"
    default:
      return "PENDING"
  }
}
