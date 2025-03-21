export const compareFiles = async () => {
    const devices1: GooglePlayData[] = ...;
    const devices2: GooglePlayData[] = ...;
  
    // Creamos un Set con los nombres normalizados de devices1 para comparación exacta
    const normalizedNames1 = new Set(devices1.map(d => d.NormalizedName));
  
    // Filtramos solo los devices2 que NO están en devices1 (comparación exacta)
    const missingDevices = devices2
      .filter(device2 => !normalizedNames1.has(device2.NormalizedName))
      .map(device2 => {
        // Ahora calculamos la similitud de este missing device con TODOS los devices1
        const similarities = devices1.map(device1 => ({
          device: device1.DisplayName,
          similarity: diceSorensen({
            wordA: device1.NormalizedName,
            wordB: device2.NormalizedName,
          }),
        }));
  
        return {
          missingDevice: device2.DisplayName,
          similarities: similarities.map(s => ({
            device: s.device,
            similarity: (s.similarity * 100).toFixed(2) + '%',
          })),
        };
      });
  
    console.log('Missing devices with similarities:', missingDevices);
    return missingDevices;
  };