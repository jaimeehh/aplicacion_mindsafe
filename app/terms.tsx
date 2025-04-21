import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../stores/auth';

export default function Terms() {
  const { acceptTerms } = useAuth();

  const handleAccept = () => {
    acceptTerms();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terms of Use</Text>
      
      <ScrollView style={styles.termsContainer}>
        <Text style={styles.termsText}>
          La información suministrada a través de este canal será clara, comprensible, concreta, íntegra y adecuada a la información solicitada, de acuerdo con lo establecido en el Decreto 21/2002, de 24 de enero, por el que se regula la atención al ciudadano en la Comunidad de Madrid. La Comunidad de Madrid desarrollará los esfuerzos precisos para evitar errores y, en su caso, repararlos o actualizarlos lo antes posible, no pudiendo garantizar su inexistencia ni que el contenido de la información se encuentre permanentemente actualizado.{'\n\n'}
          La Comunidad de Madrid podrá efectuar, en cualquier momento y sin necesidad de previo aviso, modificaciones y actualizaciones sobre la información contenida en este canal o en su configuración o presentación.{'\n\n'}
          El acceso al canal, así como el uso que pueda hacerse de la información que contiene, son de la exclusiva responsabilidad del usuario. La Comunidad de Madrid no se responsabilizará de ninguna consecuencia, daño o perjuicio que pudieran derivarse de este acceso o uso de información, con excepción de todas aquellas actuaciones que resulten de la aplicación de las disposiciones legales a las que deba someterse el estricto ejercicio de sus competencias.{'\n\n'}
          La información proporcionada a través de este canal, mediante respuesta a la consulta de expedientes o derivada de cualquier base de datos tiene carácter meramente orientativo y en ningún caso podrá ser vinculante para la resolución de los procedimientos administrativos, que se hallará sujeta exclusivamente a la normativa que les sea de aplicación.{'\n\n'}
          En este canal se han incluido enlaces a páginas de sitios web de terceros (“links”), la mayor parte a páginas de Internet de otras Administraciones Públicas, que se han considerado de interés para los usuarios. No obstante, la Comunidad de Madrid no asume ninguna responsabilidad derivada de la conexión o contenidos de los enlaces de terceros a los que se hace referencia en este canal.{'\n\n'}
          Los derechos de propiedad intelectual de este canal de Internet, su diseño gráfico y los códigos que contiene, son titularidad de la Comunidad de Madrid, a no ser que se indique una titularidad diferente. La reproducción, distribución, comercialización o transformación no autorizadas de estas obras, a no ser que sea para uso personal y privado, constituye una infracción de los derechos de propiedad intelectual de la Comunidad de Madrid o de aquél que sea titular. Igualmente, todas las marcas o signos distintivos de cualquier clase contenidos en el portal están protegidos por Ley.
          La utilización no autorizada de la información contenida en este canal, así como los perjuicios ocasionados en los derechos de propiedad intelectual e industrial de la Comunidad de Madrid, pueden dar lugar al ejercicio de las acciones que legalmente correspondan y, si procede, a las responsabilidades que de dicho ejercicio se deriven.{'\n\n'}
          Protección de datos{'\n\n'}
          El Reglamento General de Protección de Datos y la Ley Orgánica de Protección de Datos y garantía de derechos digitales son, en esencia, las normas vigentes a través de las cuales se protegen la privacidad de las personas y la seguridad de sus datos personales. Los datos personales que se pueden recabar durante su estancia en este Centro serán tratados conforme a la normativa anteriormente indicada y con la finalidad que corresponda, entre otras, prestar la asistencia sanitaria que nos demanda o garantizar su seguridad. En tal caso, el Centro resultará el responsable del tratamiento, cuyo Delegado de Protección de Datos (DPD) es el “Comité DPD de la Consejería de Sanidad de la Comunidad de Madrid”, con dirección en Paseo de la Castellana 280, planta 3, 28046 – Madrid.{'\n\n'}
          En todo momento podrá ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, en la medida que sean aplicables, a través de comunicación escrita al Responsable del Tratamiento, concretando su solicitud, adjuntando por ejemplo copia de su DNI o documento equivalente de tal modo que acredite su identidad, o bien a través del siguiente formulario (https://www.comunidad.madrid/gobierno/informacion-juridica-legislacion/proteccion-datos-mis-derechos-su-ejercicio). Asimismo, le informamos de la posibilidad de presentar una reclamación ante la Agencia Española de Protección de Datos.{'\n\n'}
          Privacidad{'\n\n'}
          En este momento, y además de las consideraciones realizadas en nuestro "aviso legal", la política de privacidad de comunidad.madrid se basa en:{'\n\n'}
          Solicitarle exclusivamente los datos estrictamente imprescindibles para poder proporcionarle los servicios del portal. Por ejemplo, si desea recibir por correo electrónico los titulares de los contenidos que le interesen   no necesita darnos más que un alias, una contraseña y dirección de correo electrónico (no se requiere nombre ni apellidos, ni dirección postal, etc...){'\n\n'}
          Sólo obtener automáticamente el mínimo de información técnica imprescindible para darle un buen servicio. Cuando se conecta, analizamos exclusivamente el tipo de navegador que está utilizando (Chrome, Firefox, Edge, Safari, etc.) y su versión con el objetivo de seleccionar la hoja de estilo más adecuada y que la visualización del portal sea correcta, así como el idioma y el juego de caracteres de su navegador con el mismo motivo (por ejemplo, para que se vean bien los acentos).{'\n\n'}
          Utilización de "cookies" de visita con objeto exclusivamente estadístico (en concreto, conocer el número de "visitantes únicos" que tiene nuestra web), y que no almacenan más información que un número de 128 bits generado aleatoriamente.{'\n\n'}
          Si el usuario de comunidad.madrid no desea aceptar la grabación de la "cookie" en su ordenador, podrá navegar por el portal sin ningún tipo de restricción.{'\n\n'}
          Estas directrices sólo son de aplicación a los contenidos albergados bajo el nuevo formato de comunidad.madrid, que reconocerá por la presencia de nuestro símbolo con el logotipo de la Comunidad de Madrid en la esquina superior derecha.
        </Text>
      </ScrollView>
      
      <TouchableOpacity style={styles.button} onPress={handleAccept}>
        <Text style={styles.buttonText}>I Accept</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  termsContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  termsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});