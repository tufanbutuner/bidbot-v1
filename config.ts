import { ClickAnalyticsPlugin } from "@microsoft/applicationinsights-clickanalytics-js";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { Pinecone } from "@pinecone-database/pinecone";

var reactPlugin = new ReactPlugin();

var clickPluginInstance = new ClickAnalyticsPlugin();
var clickPluginConfig = {
  autoCapture: true,
};

export const OpenAiHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
};

export const pinecone = new Pinecone({
  apiKey: `${process.env.PINECONE_API_KEY}`,
  environment: `${process.env.PINECONE_ENVIRONMENT}`,
});

const appInsights = new ApplicationInsights({
  config: {
    connectionString: `${process.env.APPLICATIONINSIGHTS_CONNECTION_STRING}`,
    extensions: [reactPlugin, clickPluginInstance],
    enableAutoRouteTracking: true,
    extensionConfig: {
      [clickPluginInstance.identifier]: clickPluginConfig,
    },
  },
});

// appInsights.loadAppInsights();
// appInsights.trackPageView();
