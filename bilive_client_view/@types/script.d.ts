interface modalOPtions {
  body: string | HTMLDivElement
  title?: string
  close?: string
  ok?: string
  showOK?: boolean
  onOK?: (body: string | HTMLDivElement) => void
  onClose?: (body: string | HTMLDivElement) => void
}