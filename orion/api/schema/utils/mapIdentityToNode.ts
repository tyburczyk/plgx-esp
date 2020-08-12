interface IProps {
  id: string
}

function mapIdentityToNodeId(props: IProps) {
  return props.id.replace('identity-', '')
}

export { mapIdentityToNodeId }
