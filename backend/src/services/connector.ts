import  Fluvio  from "@fluvio/client";

let fluvio: Fluvio | null = null;

export async function connectFluvio() {
  if (!fluvio) {
    fluvio = await Fluvio.connect();
  }
  return fluvio;
}

export async function getProducer(topicName: string) {
  const client = await connectFluvio();
  return client.topicProducer(topicName);
}

export async function getConsumer(topicName: string, partition: number = 0) {
  const client = await connectFluvio();
  return client.partitionConsumer(topicName, partition);
}
