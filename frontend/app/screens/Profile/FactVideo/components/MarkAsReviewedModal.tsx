import React from "react"
import {
  Button,
  ButtonText,
  ModalFooter,
  Text,
  CloseIcon,
  Heading,
  Icon,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ButtonIcon,
  CheckIcon,
} from "@gluestack-ui/themed"
import { useApi } from "app/hooks"
import { factApi } from "app/services/api"
import { navigate } from "app/navigators"

interface Props {
  factId: string
  isOpen: boolean
  setIsOpen: (arg1: boolean) => void
}

export const MarkAsReviewedModal = ({ factId, isOpen, setIsOpen }: Props) => {
  const { trigger, loading } = useApi(factApi.deleteFactForReview, {
    props: [factId],
    executeOnMount: false,
    onSuccess: () => {
      navigate({ name: "ReviewCollection", params: undefined })
      setIsOpen(false)
    },
  })

  const openModal = () => setIsOpen(true)

  const closeModal = () => setIsOpen(false)

  if (!isOpen) {
    return (
      <Button onPress={openModal} action="positive" borderRadius="$full" h="$16" w="$16">
        <ButtonIcon as={CheckIcon} size="lg" />
      </Button>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg">Mark fact as reviewed</Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text>
            If you select <Text fontWeight="$bold">Yes</Text>, this fact will no longer appear in{" "}
            <Text fontWeight="$bold">My Review Collection</Text>. Are you sure you want to proceed?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" size="sm" action="secondary" mr="$3" onPress={closeModal}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            size="sm"
            action="positive"
            borderWidth="$0"
            onPress={trigger}
            isDisabled={loading}
          >
            <ButtonText>Yes</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
