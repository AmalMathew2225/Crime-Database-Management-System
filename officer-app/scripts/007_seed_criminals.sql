-- Seed criminals table with 15 rich records for Thiruvananthapuram district
-- Run this AFTER migration 006

INSERT INTO criminals (aadhar_number, name, alias, age, gender, address, phone, photo_url, threat_level, is_absconding, is_convicted, notes) VALUES
('1234-5678-9001', 'Ravi Kumar', 'Chain Ravi', 34, 'Male', '23/B MG Road, Thampanoor, Thiruvananthapuram', '9876543210', NULL, 'High', false, true, 'Convicted for chain snatching in 2023. Known to operate near temple areas and bus stands.'),
('1234-5678-9002', 'Suresh Babu', 'Online Suresh', 45, 'Male', '12 Park Avenue, Peroorkada, Thiruvananthapuram', '9876543211', NULL, 'High', false, false, 'Multiple cyber fraud and online cheating cases. Operates fake investment schemes.'),
('1234-5678-9003', 'Jibin Joseph', 'Jibu', 22, 'Male', '5A Vanchiyoor Colony, Thiruvananthapuram', '9876543213', NULL, 'Medium', true, false, 'Absconding since robbery attempt at mobile shop. Two prior offences.'),
('1234-5678-9004', 'Pradeep Nambiar', 'Tech Pradeep', 38, 'Male', 'Flat 4C Technopark Road, Kazhakuttom, Thiruvananthapuram', '9876543214', NULL, 'High', false, false, 'Sophisticated phishing and SIM swap fraudster. IT background, targets corporate employees.'),
('1234-5678-9005', 'Aneesh Krishnan', 'Black Aneesh', 31, 'Male', '88 Fort Lane, East Fort, Thiruvananthapuram', '9844567890', NULL, 'Extreme', true, true, 'Convicted for armed robbery. Escaped custody in 2024. Considered dangerous - do not approach alone.'),
('1234-5678-9006', 'Sajan Thomas', NULL, 28, 'Male', '14/2 Karamana Bridge Road, Karamana, Thiruvananthapuram', '9812345678', NULL, 'Medium', false, false, 'Criminal trespass and break-in attempts. Pattern of targeting vacant residential properties.'),
('1234-5678-9007', 'Muhammed Ashraf', 'Ashu', 41, 'Male', '67 Chalai Market Road, Thiruvananthapuram', '9899887766', NULL, 'High', false, true, 'Convicted cheque bounce fraud. Repeat offender with multiple financial fraud cases.'),
('1234-5678-9008', 'Vinod Pillai', 'Vinod Chor', 35, 'Male', '201 Kowdiar Junction, Thiruvananthapuram', '9765432109', NULL, 'Medium', false, false, 'Mobile phone theft and petty crime near ATMs and bus stands.'),
('1234-5678-9009', 'Biju Varghese', 'Bar Biju', 27, 'Male', '9 Vanchiyoor Main Road, Thiruvananthapuram', '9654321098', NULL, 'Medium', false, false, 'Assault and bar fight incidents. Associate of Aneesh Krishnan.'),
('1234-5678-9010', 'Rajmohan S', 'Raja', 52, 'Male', '33 Statue Junction, Thiruvananthapuram', '9543210987', NULL, 'Low', false, true, 'Convicted for domestic violence. Currently on bail. Under restraining order.'),
('1234-5678-9011', 'Sreejith Menon', 'Sreji', 29, 'Male', 'Plot 15 Pattom Junction, Thiruvananthapuram', '9432109876', NULL, 'High', false, false, 'SIM swap fraud and identity theft. Works in coordination with Pradeep Nambiar.'),
('1234-5678-9012', 'Arun Dev', 'Dev', 24, 'Male', '42 East Fort Bus Stand Area, Thiruvananthapuram', '9321098765', NULL, 'Medium', false, false, 'Investment scam. Ran a fake chit fund targeting senior citizens.'),
('1234-5678-9013', 'Krishnadas P', 'KD', 46, 'Male', 'Fort Lane Back Street, Thiruvananthapuram', '9210987654', NULL, 'Low', false, false, 'Trespassing disputes. Neighbour-related civil crime escalated to criminal.'),
('1234-5678-9014', 'Shyam Lal', NULL, 39, 'Male', '78 Museum Road, Thiruvananthapuram', '9109876543', NULL, 'High', true, false, 'Cyber crime - unauthorized server access. Absconding. Believed to have fled state.'),
('1234-5678-9015', 'Rameshan K', 'Ram', 33, 'Male', 'Karamana River Bank Area, Thiruvananthapuram', '9098765432', NULL, 'Medium', false, false, 'Construction equipment theft. Two cases registered at Karamana PS.')
ON CONFLICT (aadhar_number) DO NOTHING;
