import PageTransition from '../../components/PageTransition/PageTransition'
import FacultyLeadership from '../../components/FacultyLeadership/FacultyLeadership'
import './MeetUs.css'

export default function MeetUs() {
  return (
    <PageTransition className="meetus-page">
      <FacultyLeadership />
    </PageTransition>
  )
}
