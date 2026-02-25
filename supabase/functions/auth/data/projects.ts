export type ProjectType = {
  name: string;
  description: string;
  image_url?: string;
  github_url?: string;
  live_url?: string;
};

export class Project {
  name: string;
  description: string;
  image_url?: string;
  github_url?: string;
  live_url?: string;

  constructor(data: ProjectType) {
    this.name = data.name;
    this.description = data.description;
    this.image_url = data.image_url;
    this.github_url = data.github_url;
    this.live_url = data.live_url;
  }

  isValid(): boolean {
    return !!(this.name && this.description && this.github_url);
  }

  getErrors(): string[] {
    const errors: string[] = [];
    if (!this.name) errors.push("Name is required");
    if (!this.description) errors.push("Description is required");
    if (!this.github_url) errors.push("GitHub url is required");
    return errors;
  }

  toJson(): ProjectType {
    return {
      name: this.name,
      description: this.description,
      image_url: this.image_url,
      github_url: this.github_url,
      live_url: this.live_url,
    };
  }
}
