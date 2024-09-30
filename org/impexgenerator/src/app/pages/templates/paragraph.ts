export interface CMSParagraphComponent {
    env: string;
    contentCatalog: string;
    lang: string;
    paragraphs: Array<{
      uid: string;
      name?: string;
      componentRef?: string;
      content: string;
    }>;
  }
  
  export function createCMSParagraphComponentImpex(component: CMSParagraphComponent): string {
    const contentCV = `catalogVersion(CatalogVersion.catalog(Catalog.id[default = ${component.contentCatalog}]),CatalogVersion.version[default = ${component.env}])[default = ${component.contentCatalog}:${component.env}]`;
  
    let impex = `INSERT_UPDATE CMSParagraphComponent; ${contentCV}[unique=true]; uid[unique=true]; name   ; &componentRef; ; ; ; content [lang=${component.lang}]`;
  
    component.paragraphs.forEach(paragraph => {
      impex += `
             ;                                  ; ${paragraph.uid}         ; ${paragraph.name || ''}; ${paragraph.componentRef || ''} ; ; ; ; ${paragraph.content}`;
    });
  
    return impex;
  }
  