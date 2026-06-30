type FetchJsonOptions = RequestInit & {
  label?: string;
};

export class ApiResponseError<T = unknown> extends Error {
  response: Response;
  data: T;

  constructor(message: string, response: Response, data: T) {
    super(message);
    this.name = "ApiResponseError";
    this.response = response;
    this.data = data;
  }
}

export async function fetchJson<T>(url: string, options?: FetchJsonOptions): Promise<T> {
  const { label, ...fetchOptions } = options ?? {};
  const response = await fetch(url, fetchOptions);
  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.text();

  console.log("API request", {
    label,
    url,
    status: response.status,
    contentType,
  });

  if (!contentType.includes("application/json")) {
    console.error("Non-JSON response", {
      label,
      url,
      status: response.status,
      contentType,
      body,
    });
    throw new Error("API returned HTML instead of JSON");
  }

  try {
    const data = body ? (JSON.parse(body) as T) : (null as T);

    if (!response.ok) {
      const message =
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof data.error === "string"
          ? data.error
          : `API request failed with status ${response.status}`;

      throw new ApiResponseError(message, response, data);
    }

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("JSON parsing failed", {
        label,
        url,
        status: response.status,
        contentType,
        body,
      });
      throw new Error("API response was not valid JSON");
    }

    throw error;
  }
}
