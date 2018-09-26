const learningItems = [
  {
    id: '1',
    liType: 'li-idea',
    payload: { title: 'Hi', content: 'Hello' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '2',
    liType: 'li-idea',
    payload: { title: 'Uber', content: 'AirBnB for taxis' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '3',
    liType: 'li-idea',
    payload: { title: 'Amazon Alexa', content: 'AskJeeves for speech' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '4',
    liType: 'li-image',
    payload: {
      url: 'https://i.imgur.com/pfZAxeTb.jpg',
      thumburl: 'https://i.imgur.com/pfZAxeTb.jpg'
    },
    createdAt: '2018-05-10T12:05:08.700Z'
  }
];

export const meta = {
  name: 'Gallery',
  type: 'react-component',
  shortDesc: 'Display learning items',
  description:
    'Display a list of learning items, possibly categorised, option to allow upload and voting',
  exampleData: [
    {
      title: 'Simple view',
      learningItems,
      config: {
        minVote: 1
      },
      data: {
        a1: { id: 'a1', li: '1' },
        a2: { id: 'a2', li: '2' },
        a3: { id: 'a3', li: '3' },
        a4: { id: 'a4', li: '4' }
      }
    },
    {
      title: 'With categories',
      config: {
        guidelines: 'Look at categories of image'
      },
      learningItems,
      data: {
        a1: { id: 'a1', li: '1', categories: ['tree', 'house'] },
        a2: { id: 'a2', li: '2', category: 'tree' },
        a3: { id: 'a3', li: '3', category: 'house' },
        a4: { id: 'a4', li: '4', categories: ['sky', 'tree'] }
      }
    },
    {
      title: 'With votes',
      config: {
        guidelines: 'Votez pour les images les plus interessantes',
        canVote: true,
        minVote: 2
      },
      learningItems,
      data: {
        a1: { id: 'a1', li: '1', categories: ['tree', 'house'] },
        a2: { id: 'a2', li: '2', category: 'tree' },
        a3: { id: 'a3', li: '3', category: 'house' },
        a4: { id: 'a4', li: '4', categories: ['sky', 'tree'] },
        cjmj4j8es008ukwj05d861www: {
          id: 'cjmj4j8es008ukwj05d861www',
          li: {
            id: 'cjmj4j8ep0062kwj0tld7kswu',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-09-26T12:26:42.385Z',
              createdBy: 'op-hypothesis',
              payload: {
                rows: [
                  {
                    username: 'Alan Henness',
                    text:
                      'Comment submitted, awaiting approval:\n\nYou stated:\n\n"On the 16th June 2017, The Swiss Federal Government issued a press release  [13] ..."\n\nThe document you linked to is a press release by Dachverband Komplementärmedizin, the  Swiss Umbrella Association for Complementary Medicine, not the Swiss Federal Government.\n\n"The Swiss Federal Government acknowledges that complementary medicine meets insurance regulations (Swiss Federal Health Insurance Act 1996) when it comes to effectiveness, guaranteeing high quality and safety."\n\nThe Swiss government stated:\n\n"The remuneration for the services is provisional and limited in time, because it is not necessary to prove that the services of the four complementary medical disciplines are effective, expedient and economic. It has now been shown that this proof for the disciplines is not possible."\n\nhttps://www.admin.ch/gov/de/start/dokumentation/medienmitteilungen.msg-id-61140.html (translation from German to English by Google)',
                    date: 'Thu Aug 09 2018',
                    quotation:
                      '2. Complementary Medicine (including Homeopathy) in Switzerland:\nComplementary medicine in Switzerland is now a mandatory health insurance service: The Swiss Federal Government acknowledges that complementary medicine meets insurance regulations (Swiss Federal Health Insurance Act 1996) when it comes to effectiveness, guaranteeing high quality and safety.\nOn the 16th June 2017, The Swiss Federal Government issued a press release [13] announcing that specific medical services using complementary medicine are to be covered by mandatory health insurance (basic insurance) as of 1st August 2017. The following disciplines of complementary medicine will be fully covered: Classical Homeopathy, Anthroposophical Medicine, Traditional Chinese Medicine and Herbal Medicine, provided they are practised by conventional medical practitioners who have an additional qualification in one of the four disciplines as recognised by the Swiss Medical Association. This implements one of the key demands of the Swiss constitutional referendum held on 17th May 2009.',
                    article:
                      'Positive Health Online | Article - The UK Natio...',
                    articleSite: 'www.positivehealth.com',
                    id: 'WvGbgptgEeiX8UcEPNLgjw',
                    updated: '2018-08-08T23:11:17.911170+00:00'
                  }
                ]
              }
            }
          }
        },
        cjmj4j8es008vkwj0fppeayx5: {
          id: 'cjmj4j8es008vkwj0fppeayx5',
          li: {
            id: 'cjmj4j8ep0063kwj07kte5sbp',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-09-26T12:26:42.385Z',
              createdBy: 'op-hypothesis',
              payload: {
                rows: [
                  {
                    username: 'Alan Henness',
                    text:
                      'This is incorrect.\n\nIt was not a Health Technology Assessment and this error by many homeopaths has been corrected by [Dr Felix Gurtner](https://smw.ch/article/doi/smw.2012.13723) of the Federal Office of Public Health FOPH, Health and Accident Insurance Directorate, Bern, Switzerland.',
                    date: 'Sun Jul 15 2018',
                    quotation: 'Health Technology Assessment',
                    article:
                      "Formal Complaint Against BC's Provincial Health...",
                    articleSite: 'www.drzimmermann.org',
                    id: 'i0f0NohOEeicS-9p3iOj4Q',
                    updated: '2018-07-15T16:45:55.818919+00:00'
                  }
                ]
              }
            }
          }
        },
        cjmj4j8es008wkwj0bekuhtvn: {
          id: 'cjmj4j8es008wkwj0bekuhtvn',
          li: {
            id: 'cjmj4j8ep0064kwj0yhmlg6h4',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-09-26T12:26:42.385Z',
              createdBy: 'op-hypothesis',
              payload: {
                rows: [
                  {
                    username: 'PubMedCommonsArchive',
                    text:
                      '\n<p>\n<i>On 2017 Sep 20, Kevin Wilkinson commented:</i>\n<p>\n<p><strong>Is the His6-HA-SUMO1 knock-in mouse a valid model system to study protein SUMOylation?</strong></p>\n\n<p>K.A. Wilkinson<sup>1*</sup> , S. Martin<sup>2</sup> , S.K. Tyagarajan<sup>3</sup> , O Arancio<sup>4</sup> , T.J. Craig<sup>5</sup> , C. Guo<sup>6</sup> , P.E. Fraser<sup>7</sup> , S.A.N. Goldstein<sup>8</sup> , J.M. Henley<sup>1*</sup> .</p>\n\n<p><sup>1</sup> School of Biochemistry, Centre for Synaptic Plasticity, University of Bristol, Bristol, UK. <sup>2</sup> Universit&#xE9; C&#xF4;te d&#x2019;Azur, INSERM, CNRS, IPMC, France. <sup>3</sup> Institute of Pharmacology and Toxicology, University of Zurich, Switzerland. <sup>4</sup> Taub Institute &amp; Dept of Pathology and Cell Biology, Columbia University, New York, NY, USA. <sup>5</sup> Centre for Research in Biosciences, University of the West of England, Bristol, UK. <sup>6</sup> Department of Biomedical Science, University of Sheffield, Sheffield, UK. <sup>7</sup> Tanz Centre for Research in Neurodegenerative Diseases, University of Toronto, Toronto, Canada. <sup>8</sup> Stritch School of Medicine, Loyola University, Chicago, USA.</p>\n\n<p>*Address for correspondence: <a href="mailto:kevin.wilkinson@bristol.ac.uk">kevin.wilkinson@bristol.ac.uk</a> or <a href="mailto:J.M.Henley@bristol.ac.uk">J.M.Henley@bristol.ac.uk</a>.</p>\n\n<p><strong>Introduction</strong></p>\n\n<p>There is a large and growing literature on protein SUMOylation in neurons and other cell types. While there is a consensus that most protein SUMOylation occurs within the nucleus, SUMOylation of many classes of extranuclear proteins has been identified and, importantly, functionally validated. Notably, in neurons these include neurotransmitter receptors, transporters, sodium and potassium channels, mitochondrial proteins, and numerous key pre- and post-synaptic proteins (for reviews see <a href="https://www.ncbi.nlm.nih.gov/pubmed/25287864/" title="Neuronal SUMOylation: mechanisms, physiology, and roles in neuronal dysfunction.">Henley JM, 2014</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/25110347/" title="Non-nuclear function of sumoylated proteins.">Wasik U, 2014</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/27034206/" title="Mitochondrial E3 ubiquitin ligase 1: A key enzyme in regulation of mitochondrial dynamics and functions.">Peng J, 2016</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/17987030/" title="Emerging extranuclear roles of protein SUMOylation in neuronal function and dysfunction.">Martin S, 2007</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/23934328/" title="Receptor trafficking and the regulation of synaptic plasticity by SUMO.">Luo J, 2013</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/22054923/" title="Protein SUMOylation in spine structure and function.">Craig TJ, 2012</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/17241677/" title="Sumoylation in neurons: nuclear and synaptic roles?">Scheschonka A, 2007</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/24470405/" title="Wrestling with stress: roles of protein SUMOylation and deSUMOylation in cell stress response.">Guo C, 2014</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/26920693/" title="SUMOylation and Potassium Channels: Links to Epilepsy and Sudden Death.">Wu H, 2016</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/27199730/" title="Sumoylation in Synaptic Function and Dysfunction.">Schorova L, 2016</a>). Furthermore, several groups have reported SUMO1-ylated proteins in synaptic fractions using biochemical subcellular fractionation approaches, using a range of different validated anti-SUMO1 antibodies (<a href="https://www.ncbi.nlm.nih.gov/pubmed/17486098/" title="SUMOylation regulates kainate-receptor-mediated synaptic transmission.">Martin S, 2007</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/19344328/" title="Protein SUMOylation modulates calcium influx and glutamate release from presynaptic terminals.">Feligioni M, 2009</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/27738871/" title="Targeting SUMO-1ylation Contrasts Synaptic Dysfunction in a Mouse Model of Alzheimer&apos;s Disease.">Marcelli S, 2017</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/22438991/" title="Developmental regulation and spatiotemporal redistribution of the sumoylation machinery in the rat central nervous system.">Loriol C, 2012</a>) and many studies have independently observed colocalisation of SUMO1 immunoreactivity with synaptic markers (<a href="https://www.ncbi.nlm.nih.gov/pubmed/22089239/" title="Agonist-induced PKC phosphorylation regulates GluK2 SUMOylation and kainate receptor endocytosis.">Konopacki FA, 2011</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/27819299/" title="Several posttranslational modifications act in concert to regulate gephyrin scaffolding and GABAergic transmission.">Ghosh H, 2016</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/23907729/" title="Protein sumoylation in brain development, neuronal morphology and spinogenesis.">Gwizdek C, 2013</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/23326329/" title="SUMOylation is required for glycine-induced increases in AMPA receptor surface expression (ChemLTP) in hippocampal neurons.">Jaafari N, 2013</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/24639124/" title="Spatiotemporal distribution of SUMOylation components during mouse brain development.">Hasegawa Y, 2014</a>). Tirard and co-workers (<a href="https://www.ncbi.nlm.nih.gov/pubmed/28598330/" title="Analysis of SUMO1-conjugation at synapses.">Daniel JA, 2017</a>) directly challenge this wealth of compelling evidence. Primarily using a His6-HA-SUMO1 knock-in (KI) mouse the authors contest any significant involvement of post-translational modification by SUMO1 in the function of synaptic proteins.</p>\n\n<p><strong>On what basis do Daniel <em>et al.</em> argue against synaptic SUMOylation?</strong></p>\n\n<p>Most of the experiments reported by Daniel <em>et al.</em> use a knock-in (KI) mouse that expresses His6-HA-SUMO1 in place of endogenous SUMO1. Using tissue from these mice, followed by immunoprecipitation experiments, they fail to biochemically identify SUMOylation of the previously validated SUMO targets synapsin1a (<a href="https://www.ncbi.nlm.nih.gov/pubmed/26173895/" title="SUMOylation of synapsin Ia maintains synaptic vesicle availability and is reduced in an autism mutation.">Tang LT, 2015</a>), gephyrin (<a href="https://www.ncbi.nlm.nih.gov/pubmed/27819299/" title="Several posttranslational modifications act in concert to regulate gephyrin scaffolding and GABAergic transmission.">Ghosh H, 2016</a>), GluK2 (<a href="https://www.ncbi.nlm.nih.gov/pubmed/17486098/" title="SUMOylation regulates kainate-receptor-mediated synaptic transmission.">Martin S, 2007</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/22089239/" title="Agonist-induced PKC phosphorylation regulates GluK2 SUMOylation and kainate receptor endocytosis.">Konopacki FA, 2011</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/22522402/" title="SUMOylation and phosphorylation of GluK2 regulate kainate receptor trafficking and synaptic plasticity.">Chamberlain SE, 2012</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/22483987/" title="SUMOylation of the kainate receptor subunit GluK2 contributes to the activation of the MLK3-JNK3 pathway following kainate stimulation.">Zhu QJ, 2012</a>), syntaxin1a (<a href="https://www.ncbi.nlm.nih.gov/pubmed/26635000/" title="SUMOylation of Syntaxin1A regulates presynaptic endocytosis.">Craig TJ, 2015</a>), RIM1&#x3B1; (<a href="https://www.ncbi.nlm.nih.gov/pubmed/24290762/" title="RIM1&#x3B1; SUMOylation is required for fast synaptic vesicle exocytosis.">Girach F, 2013</a>), mGluR7 (<a href="https://www.ncbi.nlm.nih.gov/pubmed/21255632/" title="Analysis of metabotropic glutamate receptor 7 as a potential substrate for SUMOylation.">Wilkinson KA, 2011</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/26631532/" title="Regulation of mGluR7 trafficking by SUMOylation in neurons.">Choi JH, 2016</a>), and synaptotagmin1 (<a href="https://www.ncbi.nlm.nih.gov/pubmed/26022678/" title="SUMO1 Affects Synaptic Function, Spine Density and Memory.">Matsuzaki S, 2015</a>). Moreover, by staining and subcellular fractionation, they also fail to detect protein SUMOylation in synaptic fractions or colocalisation of specific anti-SUMO1 signal with synaptic markers. On this basis, they conclude there is essentially no functionally relevant SUMOylation of synaptic proteins. </p>\n\n<p><strong>What are the reasons for these discrepancies?</strong> </p>\n\n<ul>\n<li>Inefficiency of His6-HA-SUMO1 conjugation and compensation by SUMO2/3 </li>\n</ul>\n\n<p>A major cause for concern is that there is 20-30% less SUMO1-ylation in His6-HA-SUMO1 KI mice than in wild-type (WT) mice (<a href="https://www.ncbi.nlm.nih.gov/pubmed/28598330/" title="Analysis of SUMO1-conjugation at synapses.">Daniel JA, 2017</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/23213215/" title="In vivo localization and identification of SUMOylated proteins in the brain of His6-HA-SUMO1 knock-in mice.">Tirard M, 2012</a>). Moreover, in the paper initially characterising these KI mice, Tirard <em>et al.</em> showed that while total protein SUMO1-ylation is reduced, total SUMO2/3-ylation is correspondingly increased (<a href="https://www.ncbi.nlm.nih.gov/pubmed/23213215/" title="In vivo localization and identification of SUMOylated proteins in the brain of His6-HA-SUMO1 knock-in mice.">Tirard M, 2012</a>). Thus, His6-HA-SUMO1 conjugation is significantly impaired and most likely compensated for by increased conjugation by SUMO2/3. Crucially, however, Daniel <em>et al.</em> do not examine modification by SUMO2/3 at any point in their recent study.<br>\nGiven that SUMO modification is notoriously difficult to detect the 20-30% reduction in His6-HA-SUMO1 compared to wild-type SUMO1 conjugation will make it even more technically challenging. Moreover, this deficit in SUMO1-ylation may well be offset by an increase in SUMO2/3-ylation of individual proteins, but this likely compensation was not tested. Since these deficits alone could explain why Daniel <em>et al.</em> failed to detect SUMO1 modification of the previously characterised synaptic substrate proteins it is surprising that they did not attempt to recapitulate SUMO1-ylation of the target proteins under the endogenous conditions in wild-type systems used in the original papers.</p>\n\n<ul>\n<li>Lack of functional studies on the substrates they examine</li>\n</ul>\n\n<p>Daniel <em>et al.</em> confine their studies to immunoblotting and immunolabelling. However, these techniques address only one aspect of validating a <em>bone fide</em> SUMO substrate. It is at least as important to examine the effects of target protein SUMOylation in functional assays. Function-based approaches such as electrophysiology or neurotransmitter release assays are not reported or even discussed by Daniel <em>et al.</em> This is an extremely important omission. We argue that simply because SUMO1-ylation of a protein is beneath the detection sensitivity in a model system that exhibits sub-endogenous levels of SUMO1-ylation, does not mean that protein is not a functionally important and physiologically relevant SUMO1 substrate. </p>\n\n<ul>\n<li>Insensitivity or inadequate use of assay systems</li>\n</ul>\n\n<p><em>Failure to detect GluK2 SUMOylation</em></p>\n\n<p>GluK2 is a prototypic synaptic SUMO1 substrate that has been validated in exogenous expression systems, neuronal cultures and rat brain (<a href="https://www.ncbi.nlm.nih.gov/pubmed/17486098/" title="SUMOylation regulates kainate-receptor-mediated synaptic transmission.">Martin S, 2007</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/22089239/" title="Agonist-induced PKC phosphorylation regulates GluK2 SUMOylation and kainate receptor endocytosis.">Konopacki FA, 2011</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/22522402/" title="SUMOylation and phosphorylation of GluK2 regulate kainate receptor trafficking and synaptic plasticity.">Chamberlain SE, 2012</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/22483987/" title="SUMOylation of the kainate receptor subunit GluK2 contributes to the activation of the MLK3-JNK3 pathway following kainate stimulation.">Zhu QJ, 2012</a>). \nDaniel <em>et al.</em> attempt to detect SUMOylation of GluK2 using immunoprecipitation experiments from the His6-HA-SUMO1 KI mice. However, a key flaw in this experiment is that the C-terminal anti-GluK2 monoclonal rabbit antibody used does not recognise SUMOylated GluK2 because its epitope is masked by SUMO conjugation. Thus, due to technical reasons, the experiment shown could not possibly detect SUMOylated GluK2 whether or not it occurs in the KI mice. </p>\n\n<p><em>Subcellular fractionation and immunolabelling</em></p>\n\n<p>Daniel <em>et al.</em> perform subcellular fractionation and anti-SUMO1 Western blots to compare His6-HA-SUMO1 KI and SUMO1 knockout (KO) mice. In the KI mice they fail to detect SUMO1-ylated proteins in synaptic fractions. Importantly, however, they do not address what happens in WT mice, which, unlike the KI mice, exhibit normal levels of SUMO1-ylation. \nWhile the authors provide beautiful images of SUMO1 immunolabelling in neurons cultured from WT, His6-HA-SUMO1 KI mice and SUMO1 KO mice, in stark contrast to previous reports using rat cultures (<a href="https://www.ncbi.nlm.nih.gov/pubmed/17486098/" title="SUMOylation regulates kainate-receptor-mediated synaptic transmission.">Martin S, 2007</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/22089239/" title="Agonist-induced PKC phosphorylation regulates GluK2 SUMOylation and kainate receptor endocytosis.">Konopacki FA, 2011</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/23907729/" title="Protein sumoylation in brain development, neuronal morphology and spinogenesis.">Gwizdek C, 2013</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/23326329/" title="SUMOylation is required for glycine-induced increases in AMPA receptor surface expression (ChemLTP) in hippocampal neurons.">Jaafari N, 2013</a>), they detect no specific synaptic SUMO1 immunoreactivity in neurons prepared from WT mice. We note, however, that the nuclear SUMO1 staining in neurons from His6-HA-SUMO1 KI mice is weak, and even weaker in WT neurons. Given that a very large proportion of SUMO1 staining is nuclear, these low detection levels would almost certainly rule out visualisation of the far less abundant, but nonetheless functionally important, extranuclear SUMO1 immunoreactivity. </p>\n\n<p><strong>In conclusion</strong></p>\n\n<p>Given these caveats we suggest that the failure of Daniel <em>et al.</em> to detect synaptic protein SUMO1-ylation in His6-HA-SUMO1 KI mice is due to intrinsic deficiencies in this model system that prevent it from reporting the low, yet physiologically relevant, levels of synaptic protein modification by endogenous SUMO1. In consequence, we question the conclusions reached and the usefulness of this model for investigation of previously identified and novel SUMO1 substrates.</p>\n\n<hr><i>\nThis comment, <a href="https://web.hypothes.is/blog/archiving-pmc-comments/">imported by Hypothesis</a> from PubMed Commons, is licensed under <a href="https://hyp.is/mQXgvA3MEeiVIcd7UQPkJw/www.ncbi.nlm.nih.gov/pubmedcommons/faq/">CC BY</a>.\n',
                    date: 'Tue Jul 03 2018',
                    article: 'Analysis of SUMO1-conjugation at synapses',
                    articleSite: 'europepmc.org',
                    id: 'UzqCvH5DEei3iOenENBlvw',
                    updated: '2018-07-02T22:00:25.663256+00:00'
                  }
                ]
              }
            }
          }
        },
        cjmj4j8es008xkwj08f6mqv4b: {
          id: 'cjmj4j8es008xkwj08f6mqv4b',
          li: {
            id: 'cjmj4j8ep0065kwj0ae77g8a9',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-09-26T12:26:42.385Z',
              createdBy: 'op-hypothesis',
              payload: {
                rows: [
                  {
                    username: 'PubMedCommonsArchive',
                    text:
                      '\n<p>\n<i>On 2017 Feb 15, thomas samaras commented:</i>\n<p>\n<p>This is an excellent paper on height trends in Sardinia. However, I disagree with the precept that height can be used as a measure of health and longevity. Many researchers view height as a byproduct of the Industrial Revolution and the Western diet.  In actuality, greater height and associated weight is harmful to our long-term health and longevity. There are many reasons for this position.</p>\n\n<ol>\n<li><p>Carrera-Bastos reported that our modern diet is not the cause for increased life expectancy (LE). Instead, our progress in sanitation, hygiene, immunization, and medical technology have driven our rise in life expectancy. This increase in life expectancy is not that great at older ages; e.g., in 1900, a 75-year old man could expect to live another 8.5 years. A 100 years later, he could expect to live 10 years. Not a substantial improvement in spite of great advances in food availability, lifestyle, medicine, worker safety, etc.</p></li>\n<li><p>A number of researchers have associated our increased height with excess nutrition, not better quality nutrition (Farb, Galton, Gubner, and Campbell). </p></li>\n<li><pre><code>Nobel prize winner, Charles Townes stated that shorter people live   \n</code></pre>\n\n<p>longer. Other scientists supporting the longevity benefits of smaller<br>\nbody size within the same species include Bartke, Rollo, Kraus, Pavard, \nPromislow, Richardson, Topol, Ringsby, Barrett, Storms, Moore, Elrick, \nDe Magahlaes and Leroi.   </p></li>\n<li><p>Carrera-Bastos, et al. reported that pre-Western societies rarely get age-related chronic diseases until they transition to a Western diet. Trowell and Burkitt  found this to be true based on their research over 40 years ago (Book: Western Diseases, Trowell and Burkitt.) Popkin noted that the food system developed in the West over the last 100+ years has been &#x201C;devastating&#x201D; to our health.</p></li>\n<li><p>A 2007 report by the World Cancer Research Fund/American Institute of Cancer Research concluded that the Industrial Revolution gave rise to the Western diet that is related to increased height, weight and chronic diseases. (This report was based on evaluation of about 7000 papers and reports.) </p></li>\n<li><p>US males are 9% taller and have a 9% shorter life expectancy. Similar differences among males and females in Japan and California Asians were found. It is unlikely that the inverse relationship in life expectancy and height is a coincidence. (Bulletin of the World Health Organization, 1992, Table 4.)</p></li>\n<li><p>High animal protein is a key aspect of the Western Diet, but it has many negative results. For example, a high protein diet increases the levels of CRP, fibrinogen, Lp (a), IGF-1, Apo B, homocysteine, type 2 diabetes, and free radicals. In addition, the metabolism of protein has more harmful byproducts; e.g., the metabolism of fats and carbs produces CO2 and water.  In contrast protein metabolism produces ammonia, urea, uric acid and hippuric acid. (Fleming, Levine, Lopez).</p></li>\n<li><p>The high LE ranking of tall countries is often cited as supporting the the conviction that taller people live longer. However, if we eliminate non-developed countries, which have high death rates during the first 5 years of life and poor medical care, the situation changes. However, among developed countries, shorter countries rank the highest compared to tall countries. For example, out of the top 10 countries, only Iceland is a tall country. The other developed countries are relatively short or medium in height: The top 10 countries include: Monaco (1), Singapore, Japan, Macau, San Marino, Iceland (tall exception), Hong Kong, Andorra, Switzerland, and Guernsey (10). The Netherlands, one of the tallest countries in Europe, ranks 25 from the top. The ranking of other tall countries include: Norway (21), Germany (34), Denmark (47), and Bosnia and Herzegovina (84). Source for LE data: CIA World Factbook, 2016 data. Male height data from Wikipedia. </p></li>\n</ol>\n\n<p>It should be pointed out that a number of confounders exist that can invalidate mortality studies that show shorter people have higher mortality.  Some of these \nconfounders include socioeconomic status, higher weight for height in shorter people, smoking, and failure to focus on ages exceeding 60 years (differences showing shorter people live longer generally occur after 60 years of age). For example,  Waaler&#x2019;s mortality study covered the entire age range. He found that between 70 and 85 years of age, tall people had a higher mortality than shorter men between 5&#x2019;7&#x201D; and 6&#x2019;. An insurance study (Build Study, 1979) found that when they compared shorter and taller men with the same degree of overweight, the shorter\nmen had a slightly lower mortality.</p>\n\n<p>Anyone interested in the evidence showing that smaller body size is related to improved  health and longevity can find evidence in the article below which is based on over 140 longevity, mortality,  survival and centenarian studies. </p>\n\n<p>Samaras TT. Evidence from eight different types of studies showing that smaller body size is related to greater longevity. JSRR 2014. 2(16): 2150-2160, 2014; Article no. JSRR.2014.16.003</p>\n\n<hr><i>\nThis comment, <a href="https://web.hypothes.is/blog/archiving-pmc-comments/">imported by Hypothesis</a> from PubMed Commons, is licensed under <a href="https://hyp.is/mQXgvA3MEeiVIcd7UQPkJw/www.ncbi.nlm.nih.gov/pubmedcommons/faq/">CC BY</a>.\n',
                    date: 'Mon Jul 02 2018',
                    article: 'https://www.ncbi.nlm.nih.gov/pubmed/28138956',
                    articleSite: 'europepmc.org',
                    id: 'lqDlQn5CEei5srtkFHOKdA',
                    updated: '2018-07-02T21:55:09.325486+00:00'
                  }
                ]
              }
            }
          }
        },
        cjmj4j8es008ykwj0fctwnxus: {
          id: 'cjmj4j8es008ykwj0fctwnxus',
          li: {
            id: 'cjmj4j8ep0066kwj016qkgj6t',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-09-26T12:26:42.385Z',
              createdBy: 'op-hypothesis',
              payload: {
                rows: [
                  {
                    username: 'PubMedCommonsArchive',
                    text:
                      '\n<p>\n<i>On 2017 May 04, Cicely Saunders Institute Journal Club commented:</i>\n<p>\n<p>This paper was discussed on 2.5.17, by students on the KCL Cicely Saunders Institute MSc in Palliative Care</p>\n\n<p>We read with interest the systematic review article by Cahill et al on the evidence for conducting palliative care family meetings.</p>\n\n<p>We congratulate the authors on their effort to include as many papers as possible by using a wide search strategy.   Ultimately, only a small number of papers were relevant to this review and were included.   The authors found significant heterogeneity within the various studies, in terms of the patient settings, interviewer background, and country of origin and culture. Study methods included both qualitative and quantitative designs, and a range of outcome measures, but there was a notable lack of RCT studies.   </p>\n\n<p>Two studies found a benefit of family meetings using validated outcome measures. A further four found a positive outcome of family meetings, but with non-validated outcome measures. We felt that the lack of validated outcome measures does not necessarily exclude their value.</p>\n\n<p>We agree with the conclusions of the authors that there is limited evidence for family meetings in the literature and that further research would be of value.  The small and diverse sample size leads to the potential for a beta error (not finding a difference where one exists).  We were surprised by the final statement of the abstract that family meetings should not be routinely adopted into clinical practice, and we do not feel that the data in the paper support this: the absence of finding is not synonymous to the finding of absence. Further, our experience in three health care settings (UK, Canada, Switzerland) is that family meetings are already widely and routinely used.</p>\n\n<p>Aina Zehnder, Emma Hernandez-Wyatt, James W Tam</p>\n\n<hr><i>\nThis comment, <a href="https://web.hypothes.is/blog/archiving-pmc-comments/">imported by Hypothesis</a> from PubMed Commons, is licensed under <a href="https://hyp.is/mQXgvA3MEeiVIcd7UQPkJw/www.ncbi.nlm.nih.gov/pubmedcommons/faq/">CC BY</a>.\n',
                    date: 'Mon Jul 02 2018',
                    article: 'https://www.ncbi.nlm.nih.gov/pubmed/27492159',
                    articleSite: 'europepmc.org',
                    id: 'ljYiHH5BEeiP_lMs0EAxaQ',
                    updated: '2018-07-02T21:47:59.175737+00:00'
                  }
                ]
              }
            }
          }
        },
        cjmj4j8es008zkwj0qtbmn21u: {
          id: 'cjmj4j8es008zkwj0qtbmn21u',
          li: {
            id: 'cjmj4j8ep0067kwj04k1pa594',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-09-26T12:26:42.385Z',
              createdBy: 'op-hypothesis',
              payload: {
                rows: [
                  {
                    username: 'PubMedCommonsArchive',
                    text:
                      '\n<p>\n<i>On 2016 May 15, Felix Scholkmann commented:</i>\n<p>\n<p>We read with interest the article by Rizzo et al. [1] about the alleged ability for diagnosing &#x201C;<em>cardiovascular disease through mitochondria respiration as depicted through biophotonic emission</em>&#x201D;. As researchers in the field of ultra-weak photon emission (UPE) from biological systems (e.g. [2-12]) (also termed &#x201C;<em>biophotonic emission</em>&#x201D;) we were surprised to notice that some important statements made in the publication of Rizzo et al. are not correct or unsubstantiated, unfortunately. In the following we will point out these issues in detail.</p>\n\n<p><strong>(1) The &#x201C;ClearView System&#x201D; is neither able to detect UPE, nor is the measurement principle related to UPE.</strong></p>\n\n<p>The authors claim that the measurement device used, i.e., the ClearView System, &#x201C;<em>can detect cardiovascular disease through the measurement of mitochondria dysfunction through biophoton emission.</em>&#x201D; Concerning the measurement principle of the ClearView System the authors wrote that the &#x201C;<em>system measures electromagnetic energy at a smaller scale through amplification of biophotons.</em>&#x201D; Furthermore, it is stated that through &#x201C;<em>measuring mitochondrial respiration via biophoton detection, the ClearView system has the ability to quantify electrophysiological biophoton activity.</em>&#x201D;</p>\n\n<p>Unfortunately, the statements are technically not correct. As described in section &#x201C;1.3 ClearView System&#x201D; of the paper, and also on the companies&#x2019; website (<a href="http://epicdiagnostics.com/clearview">http://epicdiagnostics.com/clearview</a>), the ClearView System is a corona discharge photography (CDP) device (for a detailed description of the technique see [13, 14]), i.e., a device performing contact print photographs of the coronal discharge (of the finger tip) by a high-frequency and high voltage pulse exposure (sinusoidal, 1 KHz, according to the patent for the device [15]). A CCD camera under a transparent electrode is capturing then this discharge pattern. The obtained image is due to the electrical discharge causing air-ionization and subsequently electromagnetic radiation in the optical spectrum when the excited electrons of molecules in the air return to the energetic ground state. This measured light by the device is neither &#x201C;<em>biophoton emission</em>&#x201D; nor is it due to an &#x201C;<em>amplification of biophotons</em>&#x201D;. The detection of UPE is only possible using high-sensitive photodetectors (i.e., photomultipliers or specific CCD cameras [16-19]). The optical radiation detected using CDP is a stimulated emission, whereas the UPE is a spontaneous emission. Furthermore, the authors state that the &#x201C;<em>ClearView System is a non-invasive, electrophysiological measurement tool</em>&#x201D;. And the sentence &#x201C;<em>[u]nlike other bio-impedance devices, &#x2026; the ClearView System is ...</em>&#x201D; is misleading since it links the ClearView system to &#x201C;<em>bio-impedance devices</em>&#x201D;. However, this is erroneous and introduces further confusion.</p>\n\n<p><strong>(2) The assignment of the measured corona discharge patters to mitochondria respiration is unsubstantiated.</strong></p>\n\n<p>The authors state that the used measurement device (ClearView) is able of &#x201C;<em>measuring mitochondrial respiration</em>&#x201D; indirectly, and &#x201C;<em>can detect cardiovascular disease through the measurement of mitochondria dysfunction</em>&#x201D;. Even if we assume that the device would be able to measure UPE (which we showed is not justified), the detected UPE from the skin (i.e., finger tips) is a result of many different biochemical reactions that are not necessarily linked to mitochondrial function/respiration only. A detailed description of the UPE sources in biological systems can be found in the recent reviews [20, 21].</p>\n\n<p><strong>(3) Further questionable statements.</strong></p>\n\n<p>According to the authors, the &#x201C;<em>ClearView system taps into the global electromagnetic holographic communication system via the fingertips.</em>&#x201D; Neither give the authors an explanation what they mean with the term &#x201C;<em>global electromagnetic holographic communication system</em>&#x201D; nor do they refer to scientific literature that supports their statement.</p>\n\n<p>Also the authors state that it &#x201C;<em>has been scientifically proven that every cell in the body emits more than 100,000 light impulses or photons per second.</em>&#x201D; This statement is inconsistent with the earlier statement that &#x201C;<em>biophoton emission is described to be less than 1000 photons per second per cm</em>&#x201D;. Additionally that statement contains incorrect units (it should be &#x201C;<em>per cm<sup>2</sup></em>&#x201D;).In addition the authors state that the &#x201C;<em>biophotons</em>&#x201D;, they are allegedly measuring, &#x201C;<em>have been found to be the steering mechanism behind all biochemical reactions.</em>&#x201D; Whereas there are indeed theories linking UPE to physiological functions (i.e., delivering activation energy for biochemical reactions and coordinating them) these concepts are based on theoretical work (e.g., [22]) and there exist no scientific consensus regarding this issue at present.</p>\n\n<p><strong>(4) Flaws in the studies experimental design and statistical analysis.</strong></p>\n\n<p>Although the results presented by the authors are interesting, according to our view they should be regarded with caution because of the following reasons:</p>\n\n<p>(a) A case-control study must ensure that the characteristics of the investigated populations (cases and controls) are similar, i.e. the populations should be age-matched and the number of subjects should be approximately the same [23]. Both conditions seem to be not fulfilled in the study of Rizzo et al. According to the authors the &#x201C;age of cardiovascular subjects was 64.22 (95%CI: 62.44, 65.99) and the mean age of controls was 44.14 (95% CI: 40.73, 47.55).&#x201D; That the age is a confounder was even found by the authors using the statistical analysis (i.e., OR for cardiovascular disease without considering age: 4.03 (2.71, 6.00), OR with age as a confounder: OR: 3.44 (2.13-5.55)). Additionally, the sample sizes were different (n = 195 vs. n = 64). </p>\n\n<p>(b) The authors state the studies aim was to &#x201C;<em>indicate the presence or absence of cardiovascular disease</em>&#x201D;. For such an assessment the calculation of the odds ratios are not sufficient since they give only information about the prevalence, whereas the sensitivity and specificity are important factors to determine if a biomarker is useful for diagnostic purposes [24]. Such an analysis is classically performed by calculating the receiver operating characteristic (ROC) curves and quantifying them. Unfortunately, this kind of analysis is not reported by the authors in the manuscript. However, in the patent application (from which the results of the study were taken), ROC curves were given [25]. </p>\n\n<p>(c) Another important factor in showing the usefulness of the proposed novel diagnostic approach is to show the reproducibility of the measurement. The authors report that &#x201C;<em>a second measurement session was done 3-5 minutes after the first one was completed</em>&#x201D; in order to &#x201C;assess the reproducibility and variability of the measurements&#x201D;. However, we cannot find the results of this assessment in the published paper.</p>\n\n<p>Felix Scholkmann<sup>1,</sup> <sup>2,</sup> Michal Cifra<sup>3</sup></p>\n\n<p><sup>1</sup> Biomedical Optics Research Laboratory, Division of Neonatology, University Hospital Zurich, 8091 Zurich, Switzerland</p>\n\n<p><sup>2</sup> Research Office of Complex Physical and Biological Systems (ROCoS), 8038 Zurich, Switzerland</p>\n\n<p><sup>3</sup> Institute of Photonics and Electronics, The Czech Academy of Sciences, 18200 Prague, Czech Republic</p>\n\n<hr><i>\nThis comment, <a href="https://web.hypothes.is/blog/archiving-pmc-comments/">imported by Hypothesis</a> from PubMed Commons, is licensed under <a href="https://hyp.is/mQXgvA3MEeiVIcd7UQPkJw/www.ncbi.nlm.nih.gov/pubmedcommons/faq/">CC BY</a>.\n',
                    date: 'Mon Jul 02 2018',
                    article: 'https://www.ncbi.nlm.nih.gov/pubmed/26722839',
                    articleSite: 'europepmc.org',
                    id: 'XHCvlH5AEeiY9Kcx7WEC7w',
                    updated: '2018-07-02T21:39:12.773396+00:00'
                  }
                ]
              }
            }
          }
        },
        cjmj4j8es0090kwj0qrbe0awj: {
          id: 'cjmj4j8es0090kwj0qrbe0awj',
          li: {
            id: 'cjmj4j8eq0068kwj0foqniuww',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-09-26T12:26:42.386Z',
              createdBy: 'op-hypothesis',
              payload: {
                rows: [
                  {
                    username: 'PubMedCommonsArchive',
                    text:
                      '\n<p>\n<i>On 2015 Dec 07, Manoochehr Karami commented:</i>\n<p>\n<p>Manoochehr Karami, PhD, Research Center for Health Sciences and Department of Epidemiology, School of Public Health, Hamadan University of Medical Sciences, Hamadan, Iran.</p>\n\n<p>In an interesting study published recently, Julie Y. Zhou et al.(1) highlighted the prevalence of nasopharyngeal pneumococcal colonization among children in the greater St. Louis hospital. Authors have stated &quot;pneumococcal conjugate vaccine (PCV) did not alter prevalence&quot; of nasopharyngeal carriage.\nWorld Health Organization indicated that after PCV introduction, both targeted and non-targeted vaccination population were affected by direct and indirect effects of PCV immunization(2). Moreover, published studies (3-7) supported the changes of epidemiological profile of Streptococcus pneumonia related diseases transmission and nasopharyngeal carriage even among those individuals who were not immunized against Streptococcus pneumonia.\nAccordingly, it seems Zhou JY et al. interpretations based on their findings is in question and might be affected because of potential selection bias while enrolled participants. Rational for such selection bias is the catchment area of St. Louis hospital and potential differences between study participants and non-participants. Although they have excluded some patients, however this strategy does not guarantee the representativeness of their own work. Generally speaking, better explanation for Zhou et al findings is selection bias.\nIn conclusion, lack of generalizability of this study findings should be considered by policy makers and interested readers. \n&#x2003;\nReferences:\n1.  Zhou JY, Isaacson-Schmid M, Utterson EC, et al. Prevalence of nasopharyngeal pneumococcal colonization in children and antimicrobial susceptibility profiles of carriage isolates. International Journal of Infectious Diseases;39:50-52.\n2.  World Health Organization. Measuring impact of Streptococcus pneumoniae and Haemophilus influenzae type b conjugate vaccination. WHO Press, Geneva, Switzerland, 2012.\n3.  World Health Organization.Pneumococcal vaccines WHO position paper &#x2013; 2012.Wkly Epidemiol Rec. 2012;87:129-244. .\n4.  Lehmann D, Willis J. The changing epidemiology of invasive pneumococcal disease in aboriginal and non-aboriginal western Australians from 1997 through 2007 and emergence of nonvaccine serotypes. Clinical Infectious Diseases. 2010, 50(11):1477&#x2013;1486.\n5.  Pilishvili T, Lexau C. Sustained reductions in invasive pneumococcal disease in the era of conjugate vaccine. The Journal of Infectious Diseases, 2010, 201(1):32&#x2013;41.\n6.  Davis S, Deloria-Knoll M, Kassa H, O&#x2019;Brien K. Impact of pneumococcal conjugate vaccines on nasopharyngeal carriage and invasive disease among unvaccinated people: Review of evidence on indirect effects. Vaccine.2014;32:133-145.\n7.  Karami M, Alikhani MY. Serotype Replacement and Nasopharyngeal Carriage Due to the Introduction of New Pneumococcal Conjugate Vaccine to National Routine Immunization. Jundishapur Journal of Microbiology 2015;8.</p>\n\n<hr><i>\nThis comment, <a href="https://web.hypothes.is/blog/archiving-pmc-comments/">imported by Hypothesis</a> from PubMed Commons, is licensed under <a href="https://hyp.is/mQXgvA3MEeiVIcd7UQPkJw/www.ncbi.nlm.nih.gov/pubmedcommons/faq/">CC BY</a>.\n',
                    date: 'Mon Jul 02 2018',
                    article: 'https://www.ncbi.nlm.nih.gov/pubmed/26327122',
                    articleSite: 'europepmc.org',
                    id: 'n8T4Hn4_EeisdjfN30RObA',
                    updated: '2018-07-02T21:33:56.210060+00:00'
                  }
                ]
              }
            }
          }
        },
        cjmj4j8es0091kwj0tefoos7i: {
          id: 'cjmj4j8es0091kwj0tefoos7i',
          li: {
            id: 'cjmj4j8eq0069kwj0q5er5282',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-09-26T12:26:42.386Z',
              createdBy: 'op-hypothesis',
              payload: {
                rows: [
                  {
                    username: 'PubMedCommonsArchive',
                    text:
                      '\n<p>\n<i>On 2014 Oct 06, Paul Vaucher commented:</i>\n<p>\n<p><strong>False conclusions drawn about the level of evidence of factual statements drawn from Wikipedia</strong></p>\n\n<p>Paul <strong>Vaucher</strong>, PhD, DiO<sup>1,</sup> Jean Gabriel <strong>Jeannot</strong>, MD<sup>2,</sup> Reto <strong>Auer</strong>, MD, MAS<sup>2</sup></p>\n\n<p>1 <em>University Center of Legal Medicine Lausanne-Geneva, University Hospital of Lausanne (CHUV), Lausanne, Switzerland</em></p>\n\n<p>2 <em>Department of Ambulatory Care and Community Medicine, University of Lausanne, Lausanne, Switzerland</em></p>\n\n<p>We believe Hastly et al&apos;s study (<a href="https://www.ncbi.nlm.nih.gov/pubmed/24778001/" title="Wikipedia vs peer-reviewed medical literature for information about the 10 most costly medical conditions.">Hasty RT, 2014</a>) to be misleading and that their paper should not be made available to the scientific community without serious revision. Apparently, it has passed unnoticed that the methodology and statistical analysis they used had little to do with their stated hypothesis and that their interpretation of the statistics was erroneous. Authors concluded Wikipedia to be an unreliable source of health information when an alternate interpretation of the presented results would in contrary point towards considering Wikipedia as a trusted source of information, provided rigorous reanalysis and reinterpretation. There conclusions were therefore in contradiction with other studies on the subject (<a href="https://www.ncbi.nlm.nih.gov/pubmed/24103318/" title="Wikis and collaborative writing applications in health care: a scoping review.">Archambault PM, 2013</a>, <a href="https://www.ncbi.nlm.nih.gov/pubmed/25250889/" title="Accuracy and completeness of drug information in Wikipedia: a comparison with standard textbooks of pharmacology.">Kr&#xE4;enbring J, 2014</a>) that tend to show that for topics for which health workers contribute, such as for drugs, Wikipedia&#x2019;s information as trustworthy as those from textbooks. These discrepancies can be explained by major statistical and methodological errors in Hastly et al&#x2019;s publication.</p>\n\n<p>The correct interpretation of the McNemar statistic suggests that the concordance for diabetes and back pain are significantly better than for concussion, and not the reverse, as stated by the authors. Using data provided in Table 3, for factual statements identified by both reviewers (two first columns of Table 3), for diabetes mellitus and back pain, the authors found that up to 94% of assertions on Wikipedia were verified (respectively 72 out of 75 statement and 63 out of 67, p&lt;0.001 for NcNemar statistic). In contrast, for concussion, only 65% were verified (66 out of 98, p=0.888 for NcNemar statistic ). The McNemar statistic tests whether the proportion of factual statements from both reviewers, classified as concordant or discordant by the authors, are above what would be expected by chance alone (i.e. 50%). The interpretation for diabetes mellitus, if McNemar&#x2019;s test should be used at all, is that we would fail to reject the null hypothesis of a proportion of concordance of 50% in &lt; 1% of the cases. McNemar statistic thus suggests that the concordance for diabetes and back pain are significantly better than for concussion, and not the reverse, as stated by the authors. The calculation is based on the number of discordant results on the diagonals (i.e. 34 vs 1 for diabetes mellitus). It does by no means test the discordance between Wikipedia statements and existing guidelines. To test their hypothesis, it would appear more relevant to simply report the pooled average proportion of correct statements with their confidence intervals. On a technical note, McNemar statistic should not be used when there are different numbers of assertions assessed between reviewers. McNemar is also known to be highly dependent on the number of factual statements within each article. Article with higher number of statements would reach the level of significance with higher proportion of ungrounded factual statements.</p>\n\n<p>Second, the article falsely leads readers to believe that all factual statements (assertions) from 10 Wikipedia articles were identified and independently assessed by two internist to see whether they were concordant or not. Using two reviewers is a recognized method for increasing precision of a measure. However, the authors did not to provide statistics allowing readers to assess the between-reviewers variability in the identification of assertions. Table 3 suggests that over a third of assertions were reported by only one of the two reviewers. Authors did not find a method to then resolve these dissimilarities (to use their definition in Table 2) and clearly define which assertions were factual statements and which were not. They then did not to define a method of agreement to define which assertions were supported by evidence and which were not. Analysed results therefore only tend to show that for certain topics, internists have difficulties in detecting factual statements from Wikipedia and knowing whether they are grounded or not.</p>\n\n<p>Hastly et al&#x2019;s findings suggest that while there might be some discrepancies in the quality of articles between topics, some appear of very high quality, such as diabetes mellitus and back pain. Given the unnoticed errors included in their article and the importance on the interpretation of the results, Hastly et al.&#x2019;s published article reveals that peer reviewed misleading information can also be made available to the public.</p>\n\n<p><strong>Conflicts of interest</strong> : \nReto Auer and Jean-Gabriel Jeannot are advocates of the use of Wikipedia as a\ncommunication mean to inform the population on health issues. Paul Vaucher is an\nimportant contributor to the French Wikipedia page dedicated to osteopathic medicine.</p>\n\n<hr><i>\nThis comment, <a href="https://web.hypothes.is/blog/archiving-pmc-comments/">imported by Hypothesis</a> from PubMed Commons, is licensed under <a href="https://hyp.is/mQXgvA3MEeiVIcd7UQPkJw/www.ncbi.nlm.nih.gov/pubmedcommons/faq/">CC BY</a>.\n',
                    date: 'Mon Jul 02 2018',
                    article: 'https://www.ncbi.nlm.nih.gov/pubmed/24778001',
                    articleSite: 'europepmc.org',
                    id: 'Jzdw3H48EeiDUst2lDqWmw',
                    updated: '2018-07-02T21:09:05.529768+00:00'
                  }
                ]
              }
            }
          }
        },
        cjmj4j8es0092kwj0f93iafji: {
          id: 'cjmj4j8es0092kwj0f93iafji',
          li: {
            id: 'cjmj4j8eq006akwj05pvs0d6r',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-09-26T12:26:42.386Z',
              createdBy: 'op-hypothesis',
              payload: {
                rows: [
                  {
                    username: 'PubMedCommonsArchive',
                    text:
                      '\n<p>\n<i>On 2016 Jan 19, Diana Petitti commented:</i>\n<p>\n<p><em>Financial Disclosure</em>\nI was asked to review this publication by the American Suntanning Association.  I was compensated for my time in conducting this review and in preparing a report based on the review.  The American Suntanning Association did not have rights to comment on these comments or to modify the final report.  </p>\n\n<p><em>Scope of Comment</em>\nThese comments summarize my conclusions with regard to the estimates of the prevalence of ever exposure to indoor tanning in adults.  These prevalence estimates are key inputs in the model used to estimate the number of skin cancers attributable each year to indoor tanning in United States, Northern and Western Europe, and Australia.</p>\n\n<p><em>Description of Systematic Review Eligibilty</em>\nWehner et al. (2104) state that their systematic review sought to obtain prevalence estimates &quot;representative of the general population.&quot;  They do not specify the criteria used to define an estimate of prevalence representative of the general population.  The e-Appendix description of the studies deemed eligible does not provide detail on the sampling frame/study methods or response rates.</p>\n\n<p><em>My Review</em>\nI read the full text for all but one of the 17 publications that Wehner et al. (2014) identified as reporting estimates of the prevalence of ever exposure to indoor tanning in adults.  The publication for which full text could not be retrieved (Mawn and Fleischer 1993; Wehner reference 23) provided detailed information on the study population in its abstract.  I evaluated the accuracy/credibility of Wehner et al.&#x2019;s meta-analytically derived estimates of the prevalence of ever exposure to indoor tanning in adults in the United States, Northern and Western Europe and Australia considering whether the studies were based on data representative of the general population.  The accuracy/credibility of these estimates determines the accuracy/credibility of Wehner et al.&#x2019;s model-based estimates of the number of skin cancers attributable each year to indoor tanning.</p>\n\n<p><em>My Findings</em>\n<em>United States</em></p>\n\n<p>None of the studies reporting the prevalence of ever exposure to indoor tanning in adults that Wehner et al. 2014 identified in their systematic review provide data representative of the general adult population of the United States.  Several of the studies are from haphazard samples.  For example, one study, Mawn and Fleischer 1993 (Wehner et al. reference 23), collected data using self-administered questionnaires distributed to &#x201C;477 persons in a shopping mall, at a social gathering, and on a vacation cruise ship.&#x201D;  Another study, Hoerster et al. 2007 (Wehner reference 40), collected data about the prevalence of ever exposure to indoor tanning in adults in the United States from a telephone survey of households that were selected because they had a high likelihood of having a child 14, 15, 16, or 17.  Responses about ever exposure to indoor tanning in adults pertain to households with an adult who had a child age 14, 15, 16, or 17 years.  One study, Lazovich et al. 2008 (Wehner reference 36), collected data about the prevalence of ever exposure to indoor tanning in adults in the United States using an interviewer-administered questionnaire given to a 26 adults recruited from an undergraduate psychology seminar and a convenience sample of adult staff and friends in Virginia and from flyers, announcements, and advertisements in Massachusetts.  One study Cohen et al. 2013 (Wehner reference 29) collected data about the prevalence of ever exposure to indoor tanning in adults in the United States using a self-administered questionnaire given to a &#x201C;convenience&#x201D; sample of 100 parents of children being seen in three pediatric practices in Chicago.   </p>\n\n<p>One study, Mawn and Fleischer 1993 (Wehner et al. reference 23), collected data in 1992, more than two decades before 2014, the year for which the estimate of the prevalence of ever exposure to indoor tanning in adults was made.  Several other studies collected data more than a decade before 2014.  </p>\n\n<p>The meta-analytically derived estimate of the prevalence of ever exposure to indoor tanning for adults in the United States based on the studies identified by Wehner et al. (2014) is meaningless; the estimate of the number of skin cancers attributable to indoor tanning in the United State based on this meaningless estimate is meaningless.</p>\n\n<p><em>Northern and Western Europe</em></p>\n\n<p>The Wehner et al. (2014) systematic review identified studies of the prevalence of ever exposure to indoor tanning adults that were done in the United Kingdom, Ireland, France, Germany, Denmark, and Sweden.  Only one study, Borner et al. 2009 (Wehner reference 27), had a sampling frame that could have yielded data representative of Germany but the r response rate was very low (13%).  Germany is not representative of all of Northern and Western Europe.  Austria, Belgium, Luxembourg, the Netherlands, Estonia, Finland, Iceland, Latvia, Lithuania, Norway and Switzerland are countries in Northern and Western Europe for which no prevalence data were identified.  </p>\n\n<p>One study, Br&#xE4;nstrom et al. 2004 (Wehner reference 28), collected data about the prevalence of ever exposure to indoor tanning in adults based on population-based sample limited to adults age 18-37 years in Stockholm County, Sweden.  One study, Pertl et al. 2010 (Wehner reference 37), collected data about the prevalence of ever exposure to indoor tanning in adults using an interviewer-administered questionnaire given to &#x201C;convenience sample&#x201D; of adults between age 16 and 27 recruited in &#x201C;various locations around Ireland (e.g., schools, sports clubs, universities and train stations.)&#x201D;  </p>\n\n<p>One study, Jackson et al. 1999 (Wehner reference 33), collected data in 1995, nineteen years before 2014, the year for which the estimate of prevalence was made.  Several other studies collected data more than a decade before 2014. </p>\n\n<p>The meta-analytically derived estimate of the prevalence of ever exposure to indoor tanning for adults in Northern and Western Europe based on the studies identified by Wehner et al. (2014) is meaningless; the estimate of the number of skin cancers attributable to indoor tanning in Northern and Western Europe based on this meaningless estimate is meaningless.</p>\n\n<p><em>Australia</em></p>\n\n<p>The Wehner et al. (2014) systematic review identified one study (Francis et al. 2010; Wehner reference 31) that reported a measure of the prevalence of ever exposure to indoor tanning adults in Australia that is probably &#x201C;in the ball park.&#x201D;  The prevalence measure based on data collected in 2007/2008 is reasonably current considering 2014 as the year for which the estimate was made.  The sources of data on the annual number of incident melanoma and non-melanoma skin cancers in Australia is credible and I was able to verify the accuracy of these estimates.</p>\n\n<hr><i>\nThis comment, <a href="https://web.hypothes.is/blog/archiving-pmc-comments/">imported by Hypothesis</a> from PubMed Commons, is licensed under <a href="https://hyp.is/mQXgvA3MEeiVIcd7UQPkJw/www.ncbi.nlm.nih.gov/pubmedcommons/faq/">CC BY</a>.\n',
                    date: 'Mon Jul 02 2018',
                    article: 'https://www.ncbi.nlm.nih.gov/pubmed/24477278',
                    articleSite: 'europepmc.org',
                    id: 'SdIsbn47EeiqZneXwiBHKQ',
                    updated: '2018-07-02T21:02:54.071080+00:00'
                  }
                ]
              }
            }
          }
        },
        cjmj4j8es0093kwj0zjrraet7: {
          id: 'cjmj4j8es0093kwj0zjrraet7',
          li: {
            id: 'cjmj4j8eq006bkwj0zwxryt6w',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-09-26T12:26:42.386Z',
              createdBy: 'op-hypothesis',
              payload: {
                rows: [
                  {
                    username: 'PubMedCommonsArchive',
                    text:
                      '\n<p>\n<i>On 2014 Jan 29, Peter Beerli commented:</i>\n<p>\n<p>Inheritance patterns in diploid and triploid water frog hybrids (Pelophylax esculentus) &#x2013; a comment on Pruvost et al.</p>\n\n<p>J&#xF6;rg Pl&#xF6;tner<sup>1,</sup> Gaston-Denis Guex<sup>2,</sup> Peter Beerli<sup>3,</sup> and Thomas Uzzell<sup>4</sup></p>\n\n<p>(Addresses at the end)</p>\n\n<p>Pruvost et al. (2013) described the gamete production and ploidy of water frogs from five populations in Germany, Poland, and Slovakia. Two populations were composed of P. lessonae (genotype LL), P. ridibundus (RR) and their hybridogenetic hybrid P. esculentus (LR, LLR, RRL) whereas three populations consisted of only diploid LR individuals and triploids (LLR, RRL). Based on crossing experiments involving 64 P. esculentus and the analysis of microsatellites, the authors found that diploid males (genotype LR) produced haploid gametes with a ridibundus (R) genome whereas LR females usually produced diploid eggs containing both parental genomes (LR gametes). Moreover, most of the triploid individuals transmitted to their gametes the genome that was present in two copies; i.e. the L genome was inherited from LLR triploids and the R genome from RRL triploids. Their findings confirm the principal inheritance patterns of P. esculentus, which have been known for more than three decades (e.g. Uzzell et al. 1975; G&#xFC;nther et al. 1979; Uzzell et al. 1980; Vinogradov et al. 1990). \nTransmission of two L genomes by LLR males, which was observed in the Slovakian population &#x160;ajd&#xED;kove (Mikul&#xED;&#x10D;ek and Kotl&#xED;k 2001, Pruvost et al. 2013), can be considered a rare exception. It is not certain, however, that all LLR males of this population produce only LL sperm (nine of 14 LLR males transmitted only LL gametes, but five such males produced no progeny) nor is it certain that LR males in this population transmit only the R genome (only eight F1 individuals from two crosses involving a single male could be genotyped). That no P. lessonae individuals were found in a sample of 169 individuals from this population (Mikul&#xED;&#x10D;ek and Kotl&#xED;k 2001; Provost et al. 2013) suggests that the LR individuals in this population originate from LR x LLR and/or LR x LR crosses; as mentioned by Pruvost et al., both LLR males and occasionally LR males and females are able to produce L gametes (Binkert et al. 1982; G&#xFC;nther 1983). Only a few crosses in which either the diploid or the triploid parent produced L gametes would be sufficient for the persistence of such all-hybrid populations; in a relatively large Polish esculentus population comprising 300-400 females, for example, less than 1% of the eggs laid transformed to tadpoles (Berger 1988). Thus, even a high number of artificial crossing experiments does not guarantee that rare inheritance patterns, which may be critical to population persistence, are discovered. \nBased on the 10 genetic markers that they used, Pruvost et al. suggested that the two L genomes transmitted by LLR males from &#x160;ajd&#xED;kove are identical. Identity of markers does not, however, necessarily mean identity of genomes. Mikul&#xED;&#x10D;ek and Kotl&#xED;k (2001) investigated one LLR male from this population electrophoretically and found two distinct lessonae-specific alleles at the ldh-1 locus, which is evidence that the L genomes of this male differed from each other. On the other hand, it is not certain that in all cases &#x201C;triploid hybrids recombine the genome they have in double dose&#x201D; (Pruvost et al. 2013), although evidence for recombination between the double genomes in triploids comes from enzyme loci (G&#xFC;nther et al. 1979) and microsatellites (Christiansen and Reyer 2009). Because the few polymorphic markers available until recently do not allow distinguishing between the double genomes in many triploids, it cannot be said whether recombination between the two L or the two R genomes has taken place in such individuals. Biases in sex ratio of the progeny from crosses in which triploid individuals were involved (G&#xFC;nther et al. 1979; Berger and G&#xFC;nther 1988; 1991-1992), putative recombination between the L and the R genome in triploids (e.g. Pl&#xF6;tner and Klinkhardt 1992; Christiansen et al. 2005), the occasional production of LL and LR eggs by some triploid (LLR) females (Christiansen et al. 2005; Christiansen 2009), the rare production of R or LL sperm by LLR males (Brychta and Tunner 1994; Christiansen et al. 2005), incomplete elimination of the R genome in some spermatogonia (Vinogradov et al. 1990), and chromosomal aberrations in meiosis of triploid males (G&#xFC;nther 1975) reflect the huge complexity of inheritance in triploid P. esculentus. \nP. esculentus may represent a useful model for hybrid speciation. It is not surprising, however, that hybrid forms in early stages of speciation exhibit a plethora of genetic disturbances and irregularities (Dobzhansky-Muller incompatibilities; e.g. reviewed by Landry et al. 2007; Maheshwari and Barbasch 2011) especially in gametogenesis and embryonic development expressed as fertility disorders in adults (G&#xFC;nther 1973), abnormal cleavage of eggs, malformations in larvae, and high mortality during larval development (e. g. Christiansen et al. 2005; reviewed by Ogielska 2009). The observed differences in the inheritance patterns of triploid water frog hybrids may thus be interpreted as a simple result of selection-mediated interactions between specific genomic features and spatial-environmental conditions of different evolutionary lineages representing a monophyletic group; at present there is no character-based evidence that triploid frogs are of polyphyletic origin as proposed by Pruvost et al. More genomic data are required to answer this and many other questions concerning the genetics and evolutionary history of western Palearctic water frogs.</p>\n\n<p><strong>List of references can be downloaded from here</strong></p>\n\n<p><a href="http://www.peterbeerli.com/papers/misc/Reply_Pruvost_et_al_2013.pdf">http://www.peterbeerli.com/papers/misc/Reply_Pruvost_et_al_2013.pdf</a></p>\n\n<p>1 Museum f&#xFC;r Naturkunde, Leibniz-Institut f&#xFC;r Evolutions- und Biodiversit&#xE4;tsforschung, Invalidenstra&#xDF;e 43, 10115 Berlin. Germany. Email: <a href="mailto:joerg.ploetner@mfn-berlin.de">joerg.ploetner@mfn-berlin.de</a></p>\n\n<p>2 Field Station D&#xE4;twil, 8452 Adlikon, Hauptstrasse 2, Switzerland</p>\n\n<p>3 Florida State University, Department of Scientific Computing, Tallahassee, FL 32306-4120, USA</p>\n\n<p>4 Academy of Natural Sciences, Laboratory for Molecular Systematics and Ecology, 1900 B. F. Parkway, PA 19103 Philadelphia, USA</p>\n\n<hr><i>\nThis comment, <a href="https://web.hypothes.is/blog/archiving-pmc-comments/">imported by Hypothesis</a> from PubMed Commons, is licensed under <a href="https://hyp.is/mQXgvA3MEeiVIcd7UQPkJw/www.ncbi.nlm.nih.gov/pubmedcommons/faq/">CC BY</a>.\n',
                    date: 'Mon Jul 02 2018',
                    article: 'https://www.ncbi.nlm.nih.gov/pubmed/24101984',
                    articleSite: 'europepmc.org',
                    id: 'cQI4XH46Eeiy38Ny4rq7kg',
                    updated: '2018-07-02T20:56:50.227485+00:00'
                  }
                ]
              }
            }
          }
        },
        cjmj4j8es0094kwj0zn0x1s1c: {
          id: 'cjmj4j8es0094kwj0zn0x1s1c',
          li: {
            id: 'cjmj4j8eq006ckwj0u1j0vz3l',
            liDocument: {
              liType: 'li-hypothesis',
              createdAt: '2018-09-26T12:26:42.386Z',
              createdBy: 'op-hypothesis',
              payload: {
                rows: [
                  {
                    username: 'PubMedCommonsArchive',
                    text:
                      '\n<p>\n<i>On 2017 Dec 02, Hilda Bastian commented:</i>\n<p>\n<p>Another major area of research waste is the high rate of trials abandoned for poor recruitment. <a href="https://www.ncbi.nlm.nih.gov/pubmed/29185240/" title="Insufficient recruitment and premature discontinuation of clinical trials in Switzerland: qualitative study with trialists and other stakeholders.">Briel M, 2017</a> suggests that about a quarter of all trials in Switzerland are stopped, generally because of poor recruitment. A study of phase II and III trials closed in 2011 in ClinicalTrials.gov found that 19% &quot;either terminated for failed accrual or completed with less than 85% expected enrolment, seriously compromising their statistical power&quot; (<a href="https://www.ncbi.nlm.nih.gov/pubmed/25475878/" title="Unsuccessful trial accrual and human subjects protections: an empirical analysis of recently closed trials.">Carlisle B, 2015</a>).</p>\n\n<p><a href="https://www.ncbi.nlm.nih.gov/pubmed/25322807/" title="Interventions to improve recruitment and retention in clinical trials: a survey and workshop to assess current practice and future priorities.">Bower P, 2014</a> point to the need to develop more effective methods to increase recruitment and retention of participants. That is critical. We still don&apos;t know how to prevent all the waste associated with poor recruitment to clinical trials. However, the Swiss study of stakeholders makes it clear that there are serious inadequacies in coordination and preparedness for many trials (<a href="https://www.ncbi.nlm.nih.gov/pubmed/29185240/" title="Insufficient recruitment and premature discontinuation of clinical trials in Switzerland: qualitative study with trialists and other stakeholders.">Briel M, 2017</a>). The authors point to clear areas of responsibility for funders of trials and others. The NIHR&apos;s 70-day rule, a benchmark for time to recruiting the first patient is one example of a funder trying to reduce this area of waste (<a href="https://www.nihr.ac.uk/02-documents/policy-and-standards/Clinical-Trial-Performance/Contract%20Performance%20FAQs.pdf">NIHR</a>).</p>\n\n<p><a href="https://www.ncbi.nlm.nih.gov/pubmed/29185240/" title="Insufficient recruitment and premature discontinuation of clinical trials in Switzerland: qualitative study with trialists and other stakeholders.">Briel M, 2017</a> also point to the contribution public negativity about clinical trials makes to poor recruitment. That is a problem for clinicians as well, and, too often, members of IRBs/research ethics committees. In every direction, the clinical trial project still has a lot of basic education to do.</p>\n\n<hr><i>\nThis comment, <a href="https://web.hypothes.is/blog/archiving-pmc-comments/">imported by Hypothesis</a> from PubMed Commons, is licensed under <a href="https://hyp.is/mQXgvA3MEeiVIcd7UQPkJw/www.ncbi.nlm.nih.gov/pubmedcommons/faq/">CC BY</a>.\n',
                    date: 'Mon Jul 02 2018',
                    article: 'https://www.ncbi.nlm.nih.gov/pubmed/19525005',
                    articleSite: 'europepmc.org',
                    id: '4FgwOH43EeiWUXvK_M9VVw',
                    updated: '2018-07-02T20:38:28.602850+00:00'
                  }
                ]
              }
            }
          }
        },
        cjlhuby9z000k01ywgce8n7nd: {
          id: 'cjlhuby9z000k01ywgce8n7nd',
          li: {
            id: 'cjlhuby9y000501yw9dhrwelp',
            liDocument: {
              liType: 'li-twitter',
              createdAt: '2018-08-31T10:13:37.990Z',
              createdBy: 'op-twitter',
              payload: {
                created_at: 'Fri Aug 31 10:09:48 +0000 2018',
                id: 133,
                id_str: '1035469698685710336',
                full_text:
                  '@marcelsalathe @epfl_exts @crowd_ai @foodrepo_org @appliedmldays Congrats!! Keep up the great work 👍🏼🎂🍾',
                truncated: false,
                display_text_range: [65, 103],
                entities: {
                  hashtags: [],
                  symbols: [],
                  user_mentions: [
                    {
                      screen_name: 'marcelsalathe',
                      name: 'Marcel Salathe',
                      id: 14177696,
                      id_str: '14177696',
                      indices: [0, 14]
                    },
                    {
                      screen_name: 'epfl_exts',
                      name: 'EPFL Extension School',
                      id: 7475681626784,
                      id_str: '756475681626783744',
                      indices: [15, 25]
                    },
                    {
                      screen_name: 'crowd_ai',
                      name: 'crowdAI',
                      id: 3434234,
                      id_str: '706885331224813568',
                      indices: [26, 35]
                    },
                    {
                      screen_name: 'foodrepo_org',
                      name: 'Food Repo',
                      id: 93443,
                      id_str: '953975487700795392',
                      indices: [36, 49]
                    },
                    {
                      screen_name: 'appliedmldays',
                      name: 'Applied ML Days',
                      id: 73434,
                      id_str: '763052115392593920',
                      indices: [50, 64]
                    }
                  ],
                  urls: []
                },
                metadata: {
                  iso_language_code: 'en',
                  result_type: 'recent'
                },
                source:
                  '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>',
                in_reply_to_status_id: 111,
                in_reply_to_status_id_str: '1035452255682666497',
                in_reply_to_user_id: 14177696,
                in_reply_to_user_id_str: '14177696',
                in_reply_to_screen_name: 'marcelsalathe',
                user: {
                  id: 7,
                  id_str: '778923737852805121',
                  name: 'Raffaël Vonovier',
                  screen_name: 'r_vonovier',
                  location: '',
                  description:
                    'Private banker, former Swiss diplomat and humanitarian worker. Views are my own. RT does not mean endorsement.',
                  url: null,
                  entities: {
                    description: {
                      urls: []
                    }
                  },
                  protected: false,
                  followers_count: 158,
                  friends_count: 628,
                  listed_count: 0,
                  created_at: 'Thu Sep 22 11:47:45 +0000 2016',
                  favourites_count: 2781,
                  utc_offset: null,
                  time_zone: null,
                  geo_enabled: false,
                  verified: false,
                  statuses_count: 1539,
                  lang: 'fr',
                  contributors_enabled: false,
                  is_translator: false,
                  is_translation_enabled: false,
                  profile_background_color: 'F5F8FA',
                  profile_background_image_url: null,
                  profile_background_image_url_https: null,
                  profile_background_tile: false,
                  profile_image_url:
                    'http://pbs.twimg.com/profile_images/778926903973572608/B0gwXOLw_normal.jpg',
                  profile_image_url_https:
                    'https://pbs.twimg.com/profile_images/778926903973572608/B0gwXOLw_normal.jpg',
                  profile_banner_url:
                    'https://pbs.twimg.com/profile_banners/778923737852805121/1474546088',
                  profile_link_color: '1DA1F2',
                  profile_sidebar_border_color: 'C0DEED',
                  profile_sidebar_fill_color: 'DDEEF6',
                  profile_text_color: '333333',
                  profile_use_background_image: true,
                  has_extended_profile: false,
                  default_profile: true,
                  default_profile_image: false,
                  following: false,
                  follow_request_sent: false,
                  notifications: false,
                  translator_type: 'none'
                },
                geo: null,
                coordinates: null,
                place: null,
                contributors: null,
                is_quote_status: false,
                retweet_count: 0,
                favorite_count: 0,
                favorited: false,
                retweeted: false,
                lang: 'en'
              }
            }
          }
        }
      }
    }
  ]
};
