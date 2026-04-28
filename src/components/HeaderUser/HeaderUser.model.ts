import type { TestIdProps } from "../../types";

export interface HeaderUserProps {
  testId?: TestIdProps['testId']
  name: string
  email?: string
  href?: string
  to?: string
  element?: string
  trailingIcon?: string
}
