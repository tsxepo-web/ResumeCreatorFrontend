export interface ITemplate {
  name: string;
  previewUrl?: string;
}

export interface IAvailableTemplatesResponse {
  templates: ITemplate[];
}
