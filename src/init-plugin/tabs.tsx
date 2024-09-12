import { v4 as uuid } from "uuid"
export default function (props: any, store: any, rootStore: any) {
  if (!props.tabId) {
    props.tabId = uuid()
  }
}
