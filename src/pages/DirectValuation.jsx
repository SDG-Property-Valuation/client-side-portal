import {
  Badge,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaRupeeSign } from 'react-icons/fa'
import {
  FiFileText,
  FiHome,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
} from 'react-icons/fi'
import { useI18n } from '../i18n/LanguageProvider.jsx'

function DirectValuation() {
  const { t } = useI18n()

  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <Badge colorScheme="blue" variant="subtle" w="fit-content">
          {t('valuation.badge')}
        </Badge>
        <Heading>{t('valuation.heading')}</Heading>
        <Text color="gray.700">
          {t('valuation.subheading')}
        </Text>
      </Stack>

      <Box
        bg="whiteAlpha.900"
        borderRadius="24px"
        p={{ base: 6, md: 8 }}
        boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isRequired>
            <FormLabel>{t('valuation.label.address')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiMapPin color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder={t('valuation.placeholder.address')} />
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('valuation.label.propertyType')}</FormLabel>
            <Select placeholder={t('valuation.placeholder.propertyType')}>
              <option value="residential">{t('form.option.propertyType.residential')}</option>
              <option value="commercial">{t('form.option.propertyType.commercial')}</option>
              <option value="land">{t('form.option.propertyType.land')}</option>
              <option value="industrial">{t('form.option.propertyType.industrial')}</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('valuation.label.registrationNumber')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiFileText color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder={t('valuation.placeholder.registrationNumber')} />
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('valuation.label.estimatedValue')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaRupeeSign color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder={t('valuation.placeholder.estimatedValue')} />
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('valuation.label.purpose')}</FormLabel>
            <Select placeholder={t('valuation.placeholder.purpose')}>
              <option value="loan">{t('valuation.option.purpose.loan')}</option>
              <option value="sale">{t('valuation.option.purpose.sale')}</option>
              <option value="insurance">{t('valuation.option.purpose.insurance')}</option>
              <option value="portfolio">{t('valuation.option.purpose.portfolio')}</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>{t('valuation.label.usage')}</FormLabel>
            <Select placeholder={t('valuation.placeholder.usage')}>
              <option value="owner-occupied">{t('valuation.option.usage.ownerOccupied')}</option>
              <option value="tenant">{t('valuation.option.usage.tenant')}</option>
              <option value="vacant">{t('valuation.option.usage.vacant')}</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('valuation.label.contactName')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiUser color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder={t('valuation.placeholder.contactName')} />
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('valuation.label.email')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiMail color="#94a3b8" />
              </InputLeftElement>
              <Input type="email" placeholder={t('valuation.placeholder.email')} />
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('valuation.label.phone')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiPhone color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder={t('valuation.placeholder.phone')} />
            </InputGroup>
          </FormControl>
          <FormControl>
            <FormLabel>{t('valuation.label.ownerName')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiHome color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder={t('valuation.placeholder.ownerName')} />
            </InputGroup>
          </FormControl>
        </SimpleGrid>

        <FormControl mt={6}>
          <FormLabel>{t('valuation.label.notes')}</FormLabel>
          <Textarea placeholder={t('valuation.placeholder.notes')} />
        </FormControl>

        <Stack spacing={4} mt={6}>
          <Checkbox colorScheme="blue">
            {t('valuation.confirmation')}
          </Checkbox>
          <Button colorScheme="blue" size="lg">
            {t('valuation.submit')}
          </Button>
          <Button as={RouterLink} to="/register/personal" variant="link" colorScheme="blue">
            {t('valuation.registerLink')}
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}

export default DirectValuation
